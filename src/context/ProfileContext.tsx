import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { PlayerProfile } from '@/lib/storage';
import {
  loadProfile,
  saveProfile,
  checkAndResetPRI,
  checkAndRefreshQuests,
  updateTrainingStreak,
} from '@/lib/storage';
import {
  applyXPGain,
  calculateBMI,
  calculateActualPriCost,
  checkLevelAchievements,
  getLevel,
} from '@/lib/gameEngine';
import { ALL_QUESTS, ACHIEVEMENTS, getFitnessTier } from '@/data/constants';

interface LevelUpEvent {
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
}

interface ProfileContextValue {
  profile: PlayerProfile;
  setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  completeQuest: (questId: string) => void;
  completeAchievement: (achId: string) => void;
  levelUpEvent: LevelUpEvent | null;
  clearLevelUpEvent: () => void;
  toastMessages: string[];
  clearToast: (idx: number) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    let p = loadProfile();
    p = checkAndResetPRI(p);
    p = checkAndRefreshQuests(p);
    return p;
  });
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveProfile(profile);
    }, 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [profile]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme);
  }, [profile.theme]);

  const addToast = (msg: string) => {
    setToastMessages(prev => [...prev, msg]);
    setTimeout(() => {
      setToastMessages(prev => prev.slice(1));
    }, 3500);
  };

  const clearToast = (idx: number) => {
    setToastMessages(prev => prev.filter((_, i) => i !== idx));
  };

  const clearLevelUpEvent = () => setLevelUpEvent(null);

  const completeQuest = (questId: string) => {
    setProfile(prev => {
      if (prev.completedQuestIds.includes(questId)) return prev;

      const quest = ALL_QUESTS.find(q => q.id === questId);
      if (!quest) return prev;

      const tier = getFitnessTier(prev.level);
      const bmi = calculateBMI(prev.height, prev.weight);
      const actualPriCost = calculateActualPriCost(quest.priCost, bmi, prev.level);

      // Recovery quest: restore PRI
      if (quest.priCost < 0) {
        if (prev.recoveryUsedToday) return prev;
        const newPri = Math.min(100, prev.pri + Math.abs(actualPriCost));
        return {
          ...prev,
          pri: newPri,
          recoveryUsedToday: true,
          completedQuestIds: [...prev.completedQuestIds, questId],
        };
      }

      // Check PRI safety cutoff
      if (prev.pri < tier.priCutoff + actualPriCost) {
        addToast('PRI too low! Rest before continuing.');
        return prev;
      }

      // Apply XP
      const oldLevel = getLevel(prev.totalXp);
      const { newXp, newLevel, levelsGained, updatedAttributes } = applyXPGain(
        prev.totalXp,
        quest.xp,
        prev.position,
        prev.attributes
      );

      // Check level achievements
      const newAchievements = checkLevelAchievements(newLevel, prev.unlockedAchievements);

      let updatedProfile = {
        ...prev,
        totalXp: newXp,
        level: newLevel,
        attributes: updatedAttributes,
        pri: Math.max(0, prev.pri - actualPriCost),
        completedQuestIds: [...prev.completedQuestIds, questId],
        questsCompletedToday: prev.questsCompletedToday + 1,
        unlockedAchievements: [...prev.unlockedAchievements, ...newAchievements],
        careerQuestsCompleted: {
          ...prev.careerQuestsCompleted,
          [questId]: (prev.careerQuestsCompleted[questId] ?? 0) + 1,
        },
      };

      // Update training streak
      updatedProfile = updateTrainingStreak(updatedProfile);

      // Level 100: unlock golden theme
      if (newLevel >= 100 && !prev.unlockedAchievements.includes('ach_85')) {
        updatedProfile.theme = 'golden';
        addToast('Level 100 achieved! Golden UI Theme unlocked!');
      }

      if (levelsGained > 0) {
        setLevelUpEvent({ oldLevel, newLevel, levelsGained });
        addToast(`Level Up! You are now Level ${newLevel}!`);
      }

      if (newAchievements.length > 0) {
        const achNames = newAchievements
          .map(id => ACHIEVEMENTS.find(a => a.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        addToast(`Achievement Unlocked: ${achNames}`);
      }

      return updatedProfile;
    });
  };

  const completeAchievement = (achId: string) => {
    setProfile(prev => {
      if (prev.unlockedAchievements.includes(achId)) return prev;
      const ach = ACHIEVEMENTS.find(a => a.id === achId);
      if (!ach) return prev;

      const { newXp, newLevel, levelsGained, updatedAttributes } = applyXPGain(
        prev.totalXp,
        ach.xp,
        prev.position,
        prev.attributes
      );

      if (levelsGained > 0) {
        setLevelUpEvent({ oldLevel: getLevel(prev.totalXp), newLevel, levelsGained });
      }

      addToast(`Achievement Unlocked: ${ach.name} (+${ach.xp} XP)`);

      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
        attributes: updatedAttributes,
        unlockedAchievements: [...prev.unlockedAchievements, achId],
      };
    });
  };

  return (
    <ProfileContext.Provider value={{
      profile, setProfile,
      completeQuest, completeAchievement,
      levelUpEvent, clearLevelUpEvent,
      toastMessages, clearToast,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
