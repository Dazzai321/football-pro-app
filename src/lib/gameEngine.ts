import type { AttributeKey } from '@/data/constants';
import {
  POSITION_OVR_WEIGHTS,
  POSITION_LEVEL_UP_ATTRS,
  DEFAULT_ATTRIBUTES,
  ALL_QUESTS,
  getFitnessTier,
} from '@/data/constants';

// ============================================================
// OVR CALCULATION
// ============================================================
export function calculateOVR(position: string, attributes: Record<AttributeKey, number>): number {
  const weights = POSITION_OVR_WEIGHTS[position] || POSITION_OVR_WEIGHTS['CMF'];
  let ovr = 0;
  let totalWeight = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const val = attributes[key as AttributeKey] ?? 50;
    ovr += val * weight;
    totalWeight += weight;
  }
  // Normalize if weights don't sum to 1
  if (totalWeight > 0 && totalWeight !== 1) {
    ovr = ovr / totalWeight;
  }
  return Math.round(Math.max(1, Math.min(99, ovr)));
}

// ============================================================
// BMI & EFFORT MODIFIER
// ============================================================
export function calculateBMI(heightCm: number, weightKg: number): number {
  const hm = heightCm / 100;
  return weightKg / (hm * hm);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateEffortModifier(bmi: number, level: number): number {
  let modifier = 1.0;
  if (bmi >= 25) modifier *= 1.2; // overweight penalty
  const recoveryReduction = Math.floor(level / 10) * 0.005;
  modifier = Math.max(0.5, modifier - recoveryReduction);
  return modifier;
}

export function calculateActualPriCost(baseCost: number, bmi: number, level: number): number {
  if (baseCost <= 0) return baseCost; // recovery gives PRI back
  const modifier = calculateEffortModifier(bmi, level);
  return Math.round(baseCost * modifier);
}

// ============================================================
// XP & LEVELING
// ============================================================
export const XP_PER_LEVEL = 1000;

export function getLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL);
}

export function getLevelProgress(totalXp: number): { level: number; currentXp: number; xpToNext: number; percent: number } {
  const level = getLevel(totalXp);
  const currentXp = totalXp % XP_PER_LEVEL;
  const xpToNext = XP_PER_LEVEL;
  const percent = Math.round((currentXp / xpToNext) * 100);
  return { level, currentXp, xpToNext, percent };
}

// Returns list of level-ups that occurred and bumped attributes
export function applyXPGain(
  currentXp: number,
  gainedXp: number,
  position: string,
  attributes: Record<AttributeKey, number>
): {
  newXp: number;
  newLevel: number;
  levelsGained: number;
  updatedAttributes: Record<AttributeKey, number>;
} {
  const oldLevel = getLevel(currentXp);
  const newXp = currentXp + gainedXp;
  const newLevel = getLevel(newXp);
  const levelsGained = newLevel - oldLevel;
  const updatedAttributes = { ...attributes };

  if (levelsGained > 0) {
    const bumpKeys = POSITION_LEVEL_UP_ATTRS[position] || POSITION_LEVEL_UP_ATTRS['CMF'];
    for (let i = 0; i < levelsGained; i++) {
      for (const key of bumpKeys) {
        updatedAttributes[key] = Math.min(99, (updatedAttributes[key] ?? 50) + 1);
      }
    }
  }

  return { newXp, newLevel, levelsGained, updatedAttributes };
}

// ============================================================
// PROFILE STRENGTHS & WEAKNESSES ANALYSIS
// ============================================================
export function analyzeProfile(
  position: string,
  attributes: Record<AttributeKey, number>
): { strengths: string[]; weaknesses: string[] } {
  const weights = POSITION_OVR_WEIGHTS[position] || {};
  const sortedAttrs = Object.entries(attributes).sort(([, a], [, b]) => b - a);

  const strengths: string[] = sortedAttrs
    .slice(0, 5)
    .filter(([, v]) => v >= 65)
    .map(([k]) => attrKeyToLabel(k as AttributeKey));

  const weaknesses: string[] = sortedAttrs
    .slice(-5)
    .filter(([, v]) => v <= 55)
    .map(([k]) => attrKeyToLabel(k as AttributeKey));

  // Position-weighted analysis
  const posWeaknesses = Object.entries(weights)
    .filter(([key]) => (attributes[key as AttributeKey] ?? 50) < 60)
    .map(([key]) => attrKeyToLabel(key as AttributeKey));

  const combined = [...new Set([...weaknesses, ...posWeaknesses])].slice(0, 4);

  return { strengths, weaknesses: combined };
}

export function attrKeyToLabel(key: AttributeKey): string {
  const map: Record<AttributeKey, string> = {
    attackingAwareness: 'Attacking Awareness',
    ballControl: 'Ball Control',
    dribbling: 'Dribbling',
    tightPossession: 'Tight Possession',
    lowPass: 'Low Pass',
    loftedPass: 'Lofted Pass',
    finishing: 'Finishing',
    header: 'Header',
    setPieceTaking: 'Set Piece Taking',
    curl: 'Curl',
    defensiveAwareness: 'Defensive Awareness',
    tackling: 'Tackling',
    aggression: 'Aggression',
    defensiveEngagement: 'Defensive Engagement',
    speed: 'Speed',
    acceleration: 'Acceleration',
    kickingPower: 'Kicking Power',
    jump: 'Jump',
    physicalContact: 'Physical Contact',
    balance: 'Balance',
    stamina: 'Stamina',
    gkAwareness: 'GK Awareness',
    catching: 'Catching',
    clearing: 'Clearing',
    reflexes: 'Reflexes',
    reach: 'Reach',
  };
  return map[key] ?? key;
}

// ============================================================
// AI COACH DAILY QUEST GENERATION
// ============================================================
export function generateDailyQuests(
  position: string,
  level: number,
  _attributes: Record<AttributeKey, number>,
  _completedQuestIds: string[]
): string[] {
  const tier = getFitnessTier(level);
  const maxQuests = tier.maxQuests;

  const defPositions = ['GK','CB','RB','LB','RWB','LWB','SW','DMF'];
  const attPositions = ['RWF','LWF','CF','SS','AMF'];
  const midPositions = ['CMF','RMF','LMF'];

  let preferred: string[] = [];
  if (defPositions.includes(position)) {
    preferred = ['tackles_10','flank_tracking_5','interceptions_5','def_headers_5','sliding_tackles_3','defensive_leadership'];
  } else if (attPositions.includes(position)) {
    preferred = ['dribbles_5','one_touch_goal','crosses_5','long_range_shots_5','one_touch_passes_10'];
  } else if (midPositions.includes(position)) {
    preferred = ['through_passes_3','one_touch_passes_10','tempo_run_4km','agility_cones','tactical_video'];
  }

  const eligible = ALL_QUESTS.filter((q: { intensity: string; priCost: number; id: string; positions?: string[] }) => {
    if (q.priCost < 0) return false; // exclude recovery from daily
    if (!(tier.intensities as readonly string[]).includes(q.intensity)) return false;
    return true;
  });

  // Sort: preferred first, then by position relevance
  const sorted = [...eligible].sort((a: { id: string; positions?: string[] }, b: { id: string; positions?: string[] }) => {
    const aPref = preferred.includes(a.id) ? -2 : 0;
    const bPref = preferred.includes(b.id) ? -2 : 0;
    const aPosMatch = a.positions?.includes(position) ? -1 : 0;
    const bPosMatch = b.positions?.includes(position) ? -1 : 0;
    return (aPref + aPosMatch) - (bPref + bPosMatch);
  });

  // Pick diverse set
  const selected: string[] = [];
  const usedCategories = new Set<string>();
  for (const q of sorted) {
    if (selected.length >= maxQuests) break;
    if (!usedCategories.has(q.category) || selected.length < maxQuests - 1) {
      selected.push(q.id);
      usedCategories.add(q.category);
    }
  }

  return selected.slice(0, maxQuests);
}

// ============================================================
// SQUAD OVR CALCULATION
// ============================================================
export function calculateSquadRating(
  playerOVRs: number[],
  playstyleCompatibility: number,
  tacticalBalance: number
): number {
  if (playerOVRs.length === 0) return 0;
  const avgOVR = playerOVRs.reduce((a, b) => a + b, 0) / playerOVRs.length;
  return Math.round((avgOVR * 0.5) + (playstyleCompatibility * 0.3) + (tacticalBalance * 0.2));
}

// ============================================================
// ACHIEVEMENT CHECKING
// ============================================================
export function checkLevelAchievements(level: number, unlockedIds: string[]): string[] {
  const toUnlock: string[] = [];
  if (level >= 1 && !unlockedIds.includes('ach_81')) toUnlock.push('ach_81');
  if (level >= 10 && !unlockedIds.includes('ach_82')) toUnlock.push('ach_82');
  if (level >= 50 && !unlockedIds.includes('ach_83')) toUnlock.push('ach_83');
  if (level >= 80 && !unlockedIds.includes('ach_84')) toUnlock.push('ach_84');
  if (level >= 100 && !unlockedIds.includes('ach_85')) toUnlock.push('ach_85');
  return toUnlock;
}

export function getDefaultAttributes(): Record<AttributeKey, number> {
  return { ...DEFAULT_ATTRIBUTES };
}
