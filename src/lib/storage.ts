import type { AttributeKey } from '@/data/constants';
import { DEFAULT_ATTRIBUTES } from '@/data/constants';

// ============================================================
// PLAYER PROFILE STATE
// ============================================================
export interface SquadPlayer {
  id: string;
  name: string;
  ovr: number;
  position: string;
  x: number;
  y: number;
  isCaptain: boolean;
  isUserProfile: boolean;
}

export interface PlayerProfile {
  // Personal Data
  firstName: string;
  lastName: string;
  weight: number;
  height: number;
  position: string;
  playstyle: string;
  skills: string[];

  // Attributes (26)
  attributes: Record<AttributeKey, number>;

  // RPG System
  totalXp: number;
  level: number;

  // Physical Readiness Index
  pri: number;
  lastPriReset: string; // ISO date string

  // Quests
  dailyQuestIds: string[];
  completedQuestIds: string[];
  lastQuestRefresh: string; // ISO date string
  questsCompletedToday: number;
  recoveryUsedToday: boolean;

  // Achievements
  unlockedAchievements: string[];

  // Trophies
  unlockedTrophies: string[];

  // Stats tracking
  totalGoals: number;
  totalAssists: number;
  totalCleanSheets: number;
  totalMatches: number;
  totalKmRun: number;
  trainingStreakDays: number;
  lastTrainingDate: string;
  trainingHours: number;
  weeklyQuestsCompleted: number;
  weeklyQuestsTotal: number;
  careerQuestsCompleted: Record<string, number>; // questId -> times completed

  // UI
  theme: string;
  profileLocked: boolean;
  profileCreated: boolean;

  // Squad Builder
  squadSize: string;
  teamPlaystyle: string;
  teamTactic: string;
  squadPlayers: SquadPlayer[];
}

const STORAGE_KEY = 'football_player_profile';

export const DEFAULT_PROFILE: PlayerProfile = {
  firstName: '',
  lastName: '',
  weight: 70,
  height: 175,
  position: 'CMF',
  playstyle: 'Box-to-Box',
  skills: [],
  attributes: { ...DEFAULT_ATTRIBUTES },
  totalXp: 0,
  level: 0,
  pri: 100,
  lastPriReset: new Date().toDateString(),
  dailyQuestIds: [],
  completedQuestIds: [],
  lastQuestRefresh: '',
  questsCompletedToday: 0,
  recoveryUsedToday: false,
  unlockedAchievements: [],
  unlockedTrophies: [],
  totalGoals: 0,
  totalAssists: 0,
  totalCleanSheets: 0,
  totalMatches: 0,
  totalKmRun: 0,
  trainingStreakDays: 0,
  lastTrainingDate: '',
  trainingHours: 0,
  weeklyQuestsCompleted: 0,
  weeklyQuestsTotal: 0,
  careerQuestsCompleted: {},
  theme: 'dark',
  profileLocked: false,
  profileCreated: false,
  squadSize: '11v11',
  teamPlaystyle: 'Possession Game',
  teamTactic: 'High Pressing',
  squadPlayers: [],
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    // Merge with defaults to handle new fields
    return { ...DEFAULT_PROFILE, ...parsed, attributes: { ...DEFAULT_PROFILE.attributes, ...(parsed.attributes ?? {}) } };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    console.error('Failed to save profile');
  }
}

export function exportProfile(profile: PlayerProfile): void {
  const data = JSON.stringify(profile, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'player_profile.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importProfile(file: File): Promise<PlayerProfile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Partial<PlayerProfile>;
        const profile = { ...DEFAULT_PROFILE, ...data };
        resolve(profile);
      } catch {
        reject(new Error('Invalid profile file'));
      }
    };
    reader.readAsText(file);
  });
}

// PRI reset check - resets at midnight
export function checkAndResetPRI(profile: PlayerProfile): PlayerProfile {
  const today = new Date().toDateString();
  if (profile.lastPriReset !== today) {
    return {
      ...profile,
      pri: 100,
      lastPriReset: today,
      questsCompletedToday: 0,
      recoveryUsedToday: false,
      completedQuestIds: [],
    };
  }
  return profile;
}

// Check and refresh daily quests
export function checkAndRefreshQuests(profile: PlayerProfile): PlayerProfile {
  const today = new Date().toDateString();
  if (profile.lastQuestRefresh !== today) {
    return {
      ...profile,
      lastQuestRefresh: today,
      dailyQuestIds: [], // Will be regenerated
      completedQuestIds: [],
      questsCompletedToday: 0,
    };
  }
  return profile;
}

// Update training streak
export function updateTrainingStreak(profile: PlayerProfile): PlayerProfile {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (profile.lastTrainingDate === today) return profile;

  let streak = profile.trainingStreakDays;
  if (profile.lastTrainingDate === yesterday) {
    streak += 1;
  } else if (profile.lastTrainingDate !== today) {
    streak = 1;
  }

  return {
    ...profile,
    trainingStreakDays: streak,
    lastTrainingDate: today,
  };
}
