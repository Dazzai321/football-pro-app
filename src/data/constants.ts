// ============================================================
// CORE GAME DATA CONSTANTS
// ============================================================

export const POSITIONS = [
  { id: 'GK', label: 'Goalkeeper', abbr: 'GK' },
  { id: 'CB', label: 'Centre-Back', abbr: 'CB' },
  { id: 'RB', label: 'Right Back', abbr: 'RB' },
  { id: 'LB', label: 'Left Back', abbr: 'LB' },
  { id: 'RWB', label: 'Right Wing-Back', abbr: 'RWB' },
  { id: 'LWB', label: 'Left Wing-Back', abbr: 'LWB' },
  { id: 'SW', label: 'Sweeper / Libero', abbr: 'SW' },
  { id: 'DMF', label: 'Defensive Midfielder', abbr: 'DMF' },
  { id: 'CMF', label: 'Central Midfielder', abbr: 'CMF' },
  { id: 'AMF', label: 'Attacking Midfielder', abbr: 'AMF' },
  { id: 'RMF', label: 'Right Midfielder', abbr: 'RMF' },
  { id: 'LMF', label: 'Left Midfielder', abbr: 'LMF' },
  { id: 'RWF', label: 'Right Winger', abbr: 'RWF' },
  { id: 'LWF', label: 'Left Winger', abbr: 'LWF' },
  { id: 'SS', label: 'Second Striker', abbr: 'SS' },
  { id: 'CF', label: 'Centre Forward / Striker', abbr: 'CF' },
] as const;

export const PLAYSTYLES = [
  'Offensive Goalkeeper', 'Defensive Goalkeeper', 'Build Up', 'The Destroyer',
  'Extra Frontman', 'Attacking Fullback', 'Defensive Fullback', 'Fullback Finisher',
  'Anchor Man', 'Orchestrator', 'Box-to-Box', 'Hole Player',
  'Classic No. 10', 'Creative Playmaker', 'Cross Specialist', 'Goal Poacher',
  'Fox in the Box', 'Target Man', 'Dummy Runner', 'Deep-Lying Forward',
  'Prolific Winger', 'Roaming Flank',
] as const;

export const SKILLS_LIST = [
  'Double Touch', 'Flip Flap', 'Marseille Turn', 'Sombrero', 'Cut Behind & Turn',
  'Scotch Move', 'Step On Skill', 'Scissors Feint', 'Inside Bounce', 'Step Over',
  'Rabona', 'No Look Pass', 'Heel Trick', 'One-touch Pass', 'Through Passing',
  'Weighted Pass', 'Pinpoint Crossing', 'Low Lofted Pass', 'Acrobatic Clearing',
  'Interception', 'Sliding Tackle', 'Block', 'Captaincy', 'Fighting Spirit',
  'Super-sub', 'Long Range Drive', 'Long Range Curler', 'Knuckle Shot', 'Dipping Shot',
  'Rising Shot', 'Chip Shot Control', 'Acrobatic Finishing', 'One-touch Shot', 'Header',
  'Penalty Specialist', 'GK Low Punt', 'GK High Punt', 'GK Long Throw', 'GK Penalty Saver',
] as const;

export type AttributeKey =
  | 'attackingAwareness' | 'ballControl' | 'dribbling' | 'tightPossession' | 'lowPass'
  | 'loftedPass' | 'finishing' | 'header' | 'setPieceTaking' | 'curl'
  | 'defensiveAwareness' | 'tackling' | 'aggression' | 'defensiveEngagement'
  | 'speed' | 'acceleration' | 'kickingPower' | 'jump' | 'physicalContact' | 'balance' | 'stamina'
  | 'gkAwareness' | 'catching' | 'clearing' | 'reflexes' | 'reach';

export const ATTRIBUTE_GROUPS = {
  Attacking: [
    { key: 'attackingAwareness' as AttributeKey, label: 'Attacking Awareness' },
    { key: 'ballControl' as AttributeKey, label: 'Ball Control' },
    { key: 'dribbling' as AttributeKey, label: 'Dribbling' },
    { key: 'tightPossession' as AttributeKey, label: 'Tight Possession' },
    { key: 'lowPass' as AttributeKey, label: 'Low Pass' },
    { key: 'loftedPass' as AttributeKey, label: 'Lofted Pass' },
    { key: 'finishing' as AttributeKey, label: 'Finishing' },
    { key: 'header' as AttributeKey, label: 'Header' },
    { key: 'setPieceTaking' as AttributeKey, label: 'Set Piece Taking' },
    { key: 'curl' as AttributeKey, label: 'Curl' },
  ],
  Defensive: [
    { key: 'defensiveAwareness' as AttributeKey, label: 'Defensive Awareness' },
    { key: 'tackling' as AttributeKey, label: 'Tackling' },
    { key: 'aggression' as AttributeKey, label: 'Aggression' },
    { key: 'defensiveEngagement' as AttributeKey, label: 'Defensive Engagement' },
  ],
  Physical: [
    { key: 'speed' as AttributeKey, label: 'Speed' },
    { key: 'acceleration' as AttributeKey, label: 'Acceleration' },
    { key: 'kickingPower' as AttributeKey, label: 'Kicking Power' },
    { key: 'jump' as AttributeKey, label: 'Jump' },
    { key: 'physicalContact' as AttributeKey, label: 'Physical Contact' },
    { key: 'balance' as AttributeKey, label: 'Balance' },
    { key: 'stamina' as AttributeKey, label: 'Stamina' },
  ],
  Goalkeeping: [
    { key: 'gkAwareness' as AttributeKey, label: 'GK Awareness' },
    { key: 'catching' as AttributeKey, label: 'Catching' },
    { key: 'clearing' as AttributeKey, label: 'Clearing' },
    { key: 'reflexes' as AttributeKey, label: 'Reflexes' },
    { key: 'reach' as AttributeKey, label: 'Reach' },
  ],
};

export const DEFAULT_ATTRIBUTES: Record<AttributeKey, number> = {
  attackingAwareness: 50, ballControl: 50, dribbling: 50, tightPossession: 50,
  lowPass: 50, loftedPass: 50, finishing: 50, header: 50, setPieceTaking: 50, curl: 50,
  defensiveAwareness: 50, tackling: 50, aggression: 50, defensiveEngagement: 50,
  speed: 50, acceleration: 50, kickingPower: 50, jump: 50, physicalContact: 50,
  balance: 50, stamina: 50,
  gkAwareness: 50, catching: 50, clearing: 50, reflexes: 50, reach: 50,
};

// OVR weights by position
export const POSITION_OVR_WEIGHTS: Record<string, Partial<Record<AttributeKey, number>>> = {
  GK: { gkAwareness: 0.25, catching: 0.2, reflexes: 0.2, reach: 0.15, clearing: 0.1, defensiveAwareness: 0.1 },
  CB: { defensiveAwareness: 0.25, tackling: 0.2, defensiveEngagement: 0.15, physicalContact: 0.1, header: 0.1, aggression: 0.1, speed: 0.05, jump: 0.05 },
  RB: { defensiveAwareness: 0.2, tackling: 0.15, speed: 0.15, acceleration: 0.1, defensiveEngagement: 0.1, lowPass: 0.1, stamina: 0.1, physicalContact: 0.1 },
  LB: { defensiveAwareness: 0.2, tackling: 0.15, speed: 0.15, acceleration: 0.1, defensiveEngagement: 0.1, lowPass: 0.1, stamina: 0.1, physicalContact: 0.1 },
  RWB: { speed: 0.2, acceleration: 0.15, stamina: 0.15, lowPass: 0.1, tackling: 0.1, defensiveAwareness: 0.1, dribbling: 0.1, loftedPass: 0.1 },
  LWB: { speed: 0.2, acceleration: 0.15, stamina: 0.15, lowPass: 0.1, tackling: 0.1, defensiveAwareness: 0.1, dribbling: 0.1, loftedPass: 0.1 },
  SW: { defensiveAwareness: 0.25, tackling: 0.2, speed: 0.15, physicalContact: 0.1, defensiveEngagement: 0.1, lowPass: 0.1, header: 0.1 },
  DMF: { defensiveAwareness: 0.2, tackling: 0.15, aggression: 0.1, defensiveEngagement: 0.1, lowPass: 0.15, stamina: 0.15, physicalContact: 0.1, balance: 0.05 },
  CMF: { lowPass: 0.2, ballControl: 0.15, stamina: 0.15, attackingAwareness: 0.1, defensiveAwareness: 0.1, dribbling: 0.1, speed: 0.1, acceleration: 0.1 },
  AMF: { attackingAwareness: 0.2, ballControl: 0.15, dribbling: 0.15, lowPass: 0.1, loftedPass: 0.1, finishing: 0.1, curl: 0.1, speed: 0.1 },
  RMF: { speed: 0.2, stamina: 0.15, lowPass: 0.15, dribbling: 0.1, acceleration: 0.1, attackingAwareness: 0.1, loftedPass: 0.1, defensiveAwareness: 0.1 },
  LMF: { speed: 0.2, stamina: 0.15, lowPass: 0.15, dribbling: 0.1, acceleration: 0.1, attackingAwareness: 0.1, loftedPass: 0.1, defensiveAwareness: 0.1 },
  RWF: { speed: 0.25, dribbling: 0.2, acceleration: 0.15, finishing: 0.1, attackingAwareness: 0.1, ballControl: 0.1, curl: 0.05, tightPossession: 0.05 },
  LWF: { speed: 0.25, dribbling: 0.2, acceleration: 0.15, finishing: 0.1, attackingAwareness: 0.1, ballControl: 0.1, curl: 0.05, tightPossession: 0.05 },
  SS: { attackingAwareness: 0.2, finishing: 0.2, dribbling: 0.15, ballControl: 0.1, lowPass: 0.1, speed: 0.1, curl: 0.1, header: 0.05 },
  CF: { finishing: 0.25, attackingAwareness: 0.2, header: 0.1, physicalContact: 0.1, kickingPower: 0.1, speed: 0.1, dribbling: 0.05, ballControl: 0.1 },
};

// Attribute bumps on level up by position
export const POSITION_LEVEL_UP_ATTRS: Record<string, AttributeKey[]> = {
  GK: ['gkAwareness', 'catching', 'reflexes'],
  CB: ['defensiveAwareness', 'tackling', 'physicalContact'],
  RB: ['speed', 'tackling', 'defensiveAwareness'],
  LB: ['speed', 'tackling', 'defensiveAwareness'],
  RWB: ['speed', 'stamina', 'lowPass'],
  LWB: ['speed', 'stamina', 'lowPass'],
  SW: ['defensiveAwareness', 'tackling', 'speed'],
  DMF: ['tackling', 'defensiveAwareness', 'stamina'],
  CMF: ['lowPass', 'ballControl', 'stamina'],
  AMF: ['attackingAwareness', 'dribbling', 'lowPass'],
  RMF: ['speed', 'stamina', 'dribbling'],
  LMF: ['speed', 'stamina', 'dribbling'],
  RWF: ['speed', 'dribbling', 'finishing'],
  LWF: ['speed', 'dribbling', 'finishing'],
  SS: ['finishing', 'attackingAwareness', 'dribbling'],
  CF: ['finishing', 'header', 'kickingPower'],
};

// ============================================================
// QUEST DATABASE
// ============================================================
export interface Quest {
  id: string;
  label: string;
  xp: number;
  priCost: number;
  intensity: 'low' | 'moderate' | 'high';
  category: 'physical' | 'defensive' | 'skill' | 'tactical';
  positions?: string[]; // preferred positions
}

export const ALL_QUESTS: Quest[] = [
  // From Section 2.2
  { id: 'sprint_5x', label: '100m Sprint (5 times)', xp: 150, priCost: 20, intensity: 'moderate', category: 'physical' },
  { id: 'run_5km', label: '5km Continuous Run', xp: 300, priCost: 35, intensity: 'moderate', category: 'physical' },
  { id: 'jump_rope_10', label: 'Jump Rope 10 min', xp: 100, priCost: 15, intensity: 'low', category: 'physical' },
  { id: 'squats_50', label: '50 Bodyweight Squats', xp: 150, priCost: 20, intensity: 'low', category: 'physical' },
  { id: 'hiit_20', label: '20 min HIIT Workout', xp: 250, priCost: 40, intensity: 'moderate', category: 'physical' },
  { id: 'shuttle_5min', label: '5 min Shuttle Runs', xp: 200, priCost: 30, intensity: 'moderate', category: 'physical' },
  { id: 'tackles_10', label: '10 Successful Tackles', xp: 250, priCost: 25, intensity: 'moderate', category: 'defensive', positions: ['CB','RB','LB','RWB','LWB','SW','DMF'] },
  { id: 'flank_tracking_5', label: 'Flank Tracking (5 times)', xp: 200, priCost: 30, intensity: 'moderate', category: 'defensive', positions: ['RB','LB','RWB','LWB'] },
  { id: 'interceptions_5', label: '5 Interceptions', xp: 150, priCost: 20, intensity: 'moderate', category: 'defensive' },
  { id: 'def_headers_5', label: '5 Defensive Headers', xp: 100, priCost: 15, intensity: 'low', category: 'defensive', positions: ['CB','GK'] },
  { id: 'sliding_tackles_3', label: '3 Clean Sliding Tackles', xp: 150, priCost: 20, intensity: 'moderate', category: 'defensive' },
  { id: 'crosses_5', label: '5 Pinpoint Crosses', xp: 200, priCost: 20, intensity: 'moderate', category: 'skill', positions: ['RWF','LWF','RMF','LMF','RWB','LWB'] },
  { id: 'dribbles_5', label: '5 Successful Dribbles', xp: 150, priCost: 15, intensity: 'low', category: 'skill', positions: ['RWF','LWF','AMF','CF','SS'] },
  { id: 'one_touch_passes_10', label: '10 One-touch Passes', xp: 100, priCost: 10, intensity: 'low', category: 'skill' },
  { id: 'through_passes_3', label: '3 Key Through Passes', xp: 150, priCost: 15, intensity: 'low', category: 'skill', positions: ['AMF','CMF','SS'] },
  { id: 'long_range_shots_5', label: '5 Long Range Shots on Target', xp: 200, priCost: 20, intensity: 'moderate', category: 'skill' },
  { id: 'one_touch_goal', label: '1 One-touch Goal', xp: 250, priCost: 25, intensity: 'moderate', category: 'skill', positions: ['CF','SS','RWF','LWF'] },
  { id: 'tactical_video', label: '15 min Tactical Video Analysis', xp: 100, priCost: 0, intensity: 'low', category: 'tactical' },
  { id: 'defensive_leadership', label: 'Defensive On-field Leadership', xp: 150, priCost: 10, intensity: 'low', category: 'tactical', positions: ['CB','SW','DMF'] },
  { id: 'clean_sheet', label: 'Match Clean Sheet', xp: 400, priCost: 60, intensity: 'high', category: 'defensive', positions: ['GK','CB','RB','LB'] },
  { id: 'training_win', label: 'Training Match Win', xp: 300, priCost: 50, intensity: 'high', category: 'tactical' },
  { id: 'consistent_3days', label: '3 Days Consistent Training', xp: 500, priCost: 0, intensity: 'low', category: 'tactical' },
  // Section 3.4 - Active Quests
  { id: 'light_jog_2km', label: 'Light Jogging (2km)', xp: 150, priCost: 25, intensity: 'low', category: 'physical' },
  { id: 'plank_3min', label: 'Core Stability (Plank 3 min)', xp: 100, priCost: 15, intensity: 'low', category: 'physical' },
  { id: 'ball_control_100', label: 'Ball Control (100 Juggles)', xp: 150, priCost: 20, intensity: 'low', category: 'skill' },
  { id: 'tactical_20min', label: 'Tactical Video (20 min)', xp: 75, priCost: 0, intensity: 'low', category: 'tactical' },
  { id: 'tempo_run_4km', label: 'Tempo Run (4km)', xp: 300, priCost: 40, intensity: 'moderate', category: 'physical' },
  { id: 'agility_cones', label: 'Agility Cones Drills (15 min)', xp: 250, priCost: 30, intensity: 'moderate', category: 'physical' },
  { id: 'crossing_20', label: 'Pinpoint Crossing Practice (20 Crosses)', xp: 200, priCost: 25, intensity: 'moderate', category: 'skill', positions: ['RWF','LWF','RMF','LMF'] },
  { id: 'hiit_stamina', label: 'Stamina Interval Training (HIIT)', xp: 350, priCost: 45, intensity: 'moderate', category: 'physical' },
  { id: 'endurance_8km', label: 'Endurance Run (8km)', xp: 500, priCost: 65, intensity: 'high', category: 'physical' },
  { id: 'suicide_sprints', label: 'Suicide Sprints (10 times)', xp: 400, priCost: 50, intensity: 'high', category: 'physical' },
  { id: 'match_sim', label: 'Full Match Simulation (90 min)', xp: 600, priCost: 75, intensity: 'high', category: 'tactical' },
  { id: 'box_jumps_50', label: 'Power & Explosive Jumps (50 Box Jumps)', xp: 300, priCost: 40, intensity: 'high', category: 'physical' },
  { id: 'stretching_recovery', label: '15 min Stretching (Recovery)', xp: 50, priCost: -15, intensity: 'low', category: 'physical' },
];

// ============================================================
// ACHIEVEMENTS (100)
// ============================================================
export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Physical & Endurance (1-20)
  { id: 'ach_1', name: 'First Step', description: 'Jog first 1 km in the app', xp: 100, category: 'Physical & Endurance' },
  { id: 'ach_2', name: 'Road Runner', description: 'Run 5 km in a single session', xp: 250, category: 'Physical & Endurance' },
  { id: 'ach_3', name: 'Marathoner', description: 'Run 10 km in a single session', xp: 500, category: 'Physical & Endurance' },
  { id: 'ach_4', name: 'Stamina Machine', description: 'Run continuously for 45 minutes', xp: 400, category: 'Physical & Endurance' },
  { id: 'ach_5', name: 'Speed Demon', description: 'Reach absolute max velocity during a sprint', xp: 200, category: 'Physical & Endurance' },
  { id: 'ach_6', name: 'Bullet Sprint', description: 'Complete 10 sets of 100m sprints in 1 day', xp: 300, category: 'Physical & Endurance' },
  { id: 'ach_7', name: 'Jump Master', description: 'Perform 500 jump rope skips in 1 day', xp: 150, category: 'Physical & Endurance' },
  { id: 'ach_8', name: 'Airborne', description: 'Perform 1000 jump rope skips in 1 day', xp: 350, category: 'Physical & Endurance' },
  { id: 'ach_9', name: 'Iron Legs', description: 'Complete 100 squats in 1 week', xp: 200, category: 'Physical & Endurance' },
  { id: 'ach_10', name: 'Steel Calves', description: 'Complete 300 squats in 1 week', xp: 500, category: 'Physical & Endurance' },
  { id: 'ach_11', name: 'HIIT Warrior', description: 'Complete 5 full HIIT training sessions', xp: 300, category: 'Physical & Endurance' },
  { id: 'ach_12', name: 'Unstoppable Lung', description: 'Career cumulative 50 km tracking distance', xp: 1000, category: 'Physical & Endurance' },
  { id: 'ach_13', name: 'Century Run', description: 'Career cumulative 100 km tracking distance', xp: 2500, category: 'Physical & Endurance' },
  { id: 'ach_14', name: 'Quick Feet', description: 'Complete ladder agility drills 5 times', xp: 200, category: 'Physical & Endurance' },
  { id: 'ach_15', name: 'Agility King', description: 'Complete Z-run direction change drills 10 times', xp: 300, category: 'Physical & Endurance' },
  { id: 'ach_16', name: 'Early Bird', description: 'Complete a workout session before 7:00 AM', xp: 200, category: 'Physical & Endurance' },
  { id: 'ach_17', name: 'Night Owl', description: 'Complete a workout session after 8:00 PM', xp: 200, category: 'Physical & Endurance' },
  { id: 'ach_18', name: 'No Days Off', description: 'Train in extreme weather (heavy rain or high heat)', xp: 400, category: 'Physical & Endurance' },
  { id: 'ach_19', name: 'Oxygen Booster', description: 'Document an improved resting heart rate', xp: 300, category: 'Physical & Endurance' },
  { id: 'ach_20', name: 'Powerhouse', description: 'Complete a full comprehensive bodyweight strength session', xp: 250, category: 'Physical & Endurance' },
  // Defensive Masters (21-40)
  { id: 'ach_21', name: 'Brick Wall', description: 'Make 5 clean tackles in a single match', xp: 200, category: 'Defensive Masters' },
  { id: 'ach_22', name: 'The Fortress', description: 'Make 10 clean tackles in a single match', xp: 450, category: 'Defensive Masters' },
  { id: 'ach_23', name: 'Interceptor', description: 'Execute 3 clean pass interceptions in one match', xp: 150, category: 'Defensive Masters' },
  { id: 'ach_24', name: 'Air Patrol', description: 'Win 5 aerial headers during a single match', xp: 250, category: 'Defensive Masters' },
  { id: 'ach_25', name: 'No Entry', description: 'Stop opponents in 1v1 situations 3 consecutive times', xp: 300, category: 'Defensive Masters' },
  { id: 'ach_26', name: 'Slide Master', description: 'Connect 3 clean, safe sliding tackles', xp: 200, category: 'Defensive Masters' },
  { id: 'ach_27', name: 'Tactical Foul', description: 'Perform a smart, legal foul to stop a dangerous counterattack', xp: 150, category: 'Defensive Masters' },
  { id: 'ach_28', name: 'Clean Sheet Debut', description: 'Complete your first match without conceding a goal', xp: 300, category: 'Defensive Masters' },
  { id: 'ach_29', name: 'Defensive General', description: 'Actively organize the backline during a full match', xp: 250, category: 'Defensive Masters' },
  { id: 'ach_30', name: 'Last Man Standing', description: 'Clear a certain goal directly off the goal line', xp: 400, category: 'Defensive Masters' },
  { id: 'ach_31', name: 'Body Shield', description: 'Block a powerful goal-bound shot with your body', xp: 200, category: 'Defensive Masters' },
  { id: 'ach_32', name: 'Ball Winner', description: "Win back possession in the opponent's final third", xp: 200, category: 'Defensive Masters' },
  { id: 'ach_33', name: 'Pocket Specialist', description: "Completely neutralize the opponent's fastest winger", xp: 300, category: 'Defensive Masters' },
  { id: 'ach_34', name: 'Flank Guard', description: 'Prevent 5 crosses from entering your zone', xp: 250, category: 'Defensive Masters' },
  { id: 'ach_35', name: 'Silent Killer', description: 'Win possession with zero fouls committed the entire match', xp: 350, category: 'Defensive Masters' },
  { id: 'ach_36', name: 'Recovery Pace', description: "Track back quickly to intercept an opponent's break", xp: 300, category: 'Defensive Masters' },
  { id: 'ach_37', name: 'Clearance Pro', description: 'Execute 10 box clearances under pressure', xp: 200, category: 'Defensive Masters' },
  { id: 'ach_38', name: 'Brave Heart', description: 'Dispossess a physically larger opponent cleanly', xp: 250, category: 'Defensive Masters' },
  { id: 'ach_39', name: 'Unbreakable', description: 'Keep 3 consecutive clean sheets across matches', xp: 800, category: 'Defensive Masters' },
  { id: 'ach_40', name: 'Shadow', description: 'Man-mark a dangerous striker strictly for a full 90 minutes', xp: 300, category: 'Defensive Masters' },
  // Skill & Offensive (41-60)
  { id: 'ach_41', name: 'First Touch', description: 'Bring down a difficult high-altitude ball perfectly', xp: 150, category: 'Skill & Offensive' },
  { id: 'ach_42', name: 'Double Touch King', description: 'Successfully execute a Double Touch skill in a match', xp: 200, category: 'Skill & Offensive' },
  { id: 'ach_43', name: 'Skilled', description: 'Combine and pull off 3 distinct skill moves in one game', xp: 300, category: 'Skill & Offensive' },
  { id: 'ach_44', name: 'Ankle Breaker', description: 'Execute a dribble that drops the defender on the ground', xp: 400, category: 'Skill & Offensive' },
  { id: 'ach_45', name: 'Pinpoint', description: 'Deliver a dangerous cross into the box leading to a big chance', xp: 200, category: 'Skill & Offensive' },
  { id: 'ach_46', name: 'Assist Maker', description: 'Register your first career assist inside the tracker', xp: 250, category: 'Skill & Offensive' },
  { id: 'ach_47', name: 'Maestro', description: 'Provide 2 assists in a single match', xp: 500, category: 'Skill & Offensive' },
  { id: 'ach_48', name: 'Ice In Veins', description: 'Score your first career goal in the tracker', xp: 250, category: 'Skill & Offensive' },
  { id: 'ach_49', name: 'Brace', description: 'Score exactly 2 goals in a single match', xp: 500, category: 'Skill & Offensive' },
  { id: 'ach_50', name: 'Hat-Trick Hero', description: 'Score 3 goals (Hat-trick) in one match', xp: 1000, category: 'Skill & Offensive' },
  { id: 'ach_51', name: 'Sniper', description: 'Score a clean long-range goal from outside the penalty box', xp: 400, category: 'Skill & Offensive' },
  { id: 'ach_52', name: 'One-Touch Goal', description: 'Finishes a cross or pass directly into the net from 1-touch', xp: 300, category: 'Skill & Offensive' },
  { id: 'ach_53', name: 'Air Threat', description: 'Score a powerful goal using a diving or standing header', xp: 300, category: 'Skill & Offensive' },
  { id: 'ach_54', name: 'Free-Kick Wizard', description: 'Convert a direct set-piece free kick into a goal', xp: 500, category: 'Skill & Offensive' },
  { id: 'ach_55', name: 'Penalty King', description: 'Comfortably convert a critical match penalty kick', xp: 200, category: 'Skill & Offensive' },
  { id: 'ach_56', name: 'Nutmeg', description: "Execute a clean nutmeg (passing through a defender's legs)", xp: 300, category: 'Skill & Offensive' },
  { id: 'ach_57', name: 'Cross Master', description: 'Provide 5 accurate crosses to forward lines in a match', xp: 350, category: 'Skill & Offensive' },
  { id: 'ach_58', name: 'Playmaker', description: "Complete 20 accurate passes inside the opponent's half", xp: 250, category: 'Skill & Offensive' },
  { id: 'ach_59', name: 'Volley', description: 'Score a goal out of the air before the ball hits the ground', xp: 450, category: 'Skill & Offensive' },
  { id: 'ach_60', name: 'Clutch Player', description: 'Score or assist a critical last-minute match-winning goal', xp: 600, category: 'Skill & Offensive' },
  // Midfield & Passing (61-70)
  { id: 'ach_61', name: 'First Pass', description: 'Complete your first 100% clean accurate pass', xp: 50, category: 'Midfield & Passing' },
  { id: 'ach_62', name: 'Pass Master', description: 'Complete 30 accurate passes inside a single match', xp: 300, category: 'Midfield & Passing' },
  { id: 'ach_63', name: 'Laser Pass', description: 'Execute a defensive-line splitting through-ball', xp: 250, category: 'Midfield & Passing' },
  { id: 'ach_64', name: 'Ping Long', description: 'Hit an accurate cross-field long pass exceeding 30 meters', xp: 200, category: 'Midfield & Passing' },
  { id: 'ach_65', name: 'One-Touch Passing', description: 'Put together a string of 5 rapid 1-touch passes', xp: 200, category: 'Midfield & Passing' },
  { id: 'ach_66', name: 'Tempo Control', description: 'Retain possession under hard pressure for over 10 seconds', xp: 200, category: 'Midfield & Passing' },
  { id: 'ach_67', name: 'Engine', description: 'Cover a massive 8 km of hard tactical running in midfield', xp: 400, category: 'Midfield & Passing' },
  { id: 'ach_68', name: 'Wall Pass', description: 'Execute a perfect One-Two combination to split the midfield', xp: 250, category: 'Midfield & Passing' },
  { id: 'ach_69', name: 'Switch Play', description: 'Switch the attack axis perfectly from wing to wing', xp: 200, category: 'Midfield & Passing' },
  { id: 'ach_70', name: 'Unsung Hero', description: 'Make 10 decoy off-the-ball runs to open up defensive lines', xp: 300, category: 'Midfield & Passing' },
  // Mental & Tactical (71-80)
  { id: 'ach_71', name: 'Student of the Game', description: 'Watch and systematically analyze 5 tactical videos', xp: 200, category: 'Mental & Tactical' },
  { id: 'ach_72', name: 'Tactician', description: 'Carry out a complex tactical task assigned by your coach', xp: 250, category: 'Mental & Tactical' },
  { id: 'ach_73', name: 'Captaincy Debut', description: 'Put on the captain\'s armband for your first match', xp: 300, category: 'Mental & Tactical' },
  { id: 'ach_74', name: 'Leader', description: 'Organize and rally the squad to rescue a losing position', xp: 300, category: 'Mental & Tactical' },
  { id: 'ach_75', name: 'Cool Head', description: 'Complete an intense, heated rivalry match without cards', xp: 250, category: 'Mental & Tactical' },
  { id: 'ach_76', name: 'Fair Play', description: 'Stop play to assist an injured player on the pitch', xp: 200, category: 'Mental & Tactical' },
  { id: 'ach_77', name: 'Iron Mind', description: 'Bounce back and maintain composure after committing an error', xp: 300, category: 'Mental & Tactical' },
  { id: 'ach_78', name: 'Comeback Kid', description: 'Win a match after being down by 2 clear goals', xp: 500, category: 'Mental & Tactical' },
  { id: 'ach_79', name: 'Analyst', description: 'Review post-match app data charts to adapt weaknesses', xp: 150, category: 'Mental & Tactical' },
  { id: 'ach_80', name: 'Versatile', description: 'Step out of your comfort zone into an unfamiliar position', xp: 350, category: 'Mental & Tactical' },
  // Consistency & App Usage (81-100)
  { id: 'ach_81', name: 'Day One', description: 'Set up your profile and cross into Level 1', xp: 50, category: 'Consistency & App Usage' },
  { id: 'ach_82', name: 'First Milestone', description: 'Push your character profile up to Level 10', xp: 500, category: 'Consistency & App Usage' },
  { id: 'ach_83', name: 'Halfway There', description: 'Push your character profile up to Level 50', xp: 2000, category: 'Consistency & App Usage' },
  { id: 'ach_84', name: 'The Elite', description: 'Push your character profile up to Level 80', xp: 4000, category: 'Consistency & App Usage' },
  { id: 'ach_85', name: 'Maxed Out', description: 'Reach the legendary milestone of Level 100', xp: 10000, category: 'Consistency & App Usage' },
  { id: 'ach_86', name: 'Consistent', description: 'Maintain a continuous 3-day workout log in the app', xp: 300, category: 'Consistency & App Usage' },
  { id: 'ach_87', name: 'Dedicated', description: 'Maintain a continuous 7-day workout log in the app', xp: 700, category: 'Consistency & App Usage' },
  { id: 'ach_88', name: 'Addicted', description: 'Maintain a continuous 30-day workout log in the app', xp: 3000, category: 'Consistency & App Usage' },
  { id: 'ach_89', name: 'Streak Master', description: 'Recover or maintain an active long-term streak counter', xp: 500, category: 'Consistency & App Usage' },
  { id: 'ach_90', name: 'Weekend Warrior', description: 'Log heavily demanding intense drill sessions over weekends', xp: 250, category: 'Consistency & App Usage' },
  { id: 'ach_91', name: 'Social Player', description: 'Successfully add your first team friend inside the app', xp: 100, category: 'Consistency & App Usage' },
  { id: 'ach_92', name: 'Squad Goals', description: 'Put together a local training group of 5 real-life players', xp: 300, category: 'Consistency & App Usage' },
  { id: 'ach_93', name: 'Competitive', description: 'Initiate a head-to-head sprint or skill challenge with a peer', xp: 200, category: 'Consistency & App Usage' },
  { id: 'ach_94', name: 'Dominator', description: 'Rank #1 on your local friends leaderboard for a whole week', xp: 500, category: 'Consistency & App Usage' },
  { id: 'ach_95', name: 'Self-Correction', description: 'Finish an individual routine targeted to fix your weakness', xp: 200, category: 'Consistency & App Usage' },
  { id: 'ach_96', name: 'Perfect Week', description: 'Check off 100% of all generated weekly active quests', xp: 1000, category: 'Consistency & App Usage' },
  { id: 'ach_97', name: 'Evolution', description: 'Boost a single physical metric rating by +5 points', xp: 400, category: 'Consistency & App Usage' },
  { id: 'ach_98', name: 'Hard Worker', description: 'Accumulate 24 total hours of recorded training', xp: 1500, category: 'Consistency & App Usage' },
  { id: 'ach_99', name: 'Legendary Grinder', description: 'Accumulate 100 total hours of recorded training', xp: 5000, category: 'Consistency & App Usage' },
  { id: 'ach_100', name: 'The Chosen One', description: 'Unlock all 99 previous career achievements', xp: 15000, category: 'Consistency & App Usage' },
];

// ============================================================
// TROPHIES (15)
// ============================================================
export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Trophy {
  id: string;
  name: string;
  condition: string;
  tier: TrophyTier;
}

export const TROPHIES: Trophy[] = [
  { id: 'trophy_1', name: 'The Rookie Cup', condition: 'Reach Level 20', tier: 'bronze' },
  { id: 'trophy_2', name: 'The Sprinter Trophy', condition: 'Run 50km total sprints', tier: 'bronze' },
  { id: 'trophy_3', name: 'The Clean Shield', condition: 'Achieve 5 clean sheets', tier: 'bronze' },
  { id: 'trophy_4', name: 'The Playmaker Vase', condition: 'Register 10 assists', tier: 'bronze' },
  { id: 'trophy_5', name: 'The Sharp Shooter', condition: 'Score 10 long-range goals', tier: 'bronze' },
  { id: 'trophy_6', name: 'The Veteran Cup', condition: 'Reach Level 60', tier: 'silver' },
  { id: 'trophy_7', name: 'The Iron Man Trophy', condition: '60-day training streak', tier: 'silver' },
  { id: 'trophy_8', name: 'The Tactician Shield', condition: 'Win 15 tactical games', tier: 'silver' },
  { id: 'trophy_9', name: 'The Golden Boot', condition: 'Score 30 seasonal goals', tier: 'silver' },
  { id: 'trophy_10', name: 'The Wall of Football', condition: '15 seasonal clean sheets', tier: 'silver' },
  { id: 'trophy_11', name: 'The Masterclass Cup', condition: 'Reach Level 90', tier: 'gold' },
  { id: 'trophy_12', name: 'The Centurion Trophy', condition: '100 matches played', tier: 'gold' },
  { id: 'trophy_13', name: 'The Invincible Shield', condition: '10-match undefeated streak', tier: 'gold' },
  { id: 'trophy_14', name: 'The Ultimate Athlete', condition: '1,000 km running', tier: 'gold' },
  { id: 'trophy_15', name: 'The GOAT Trophy', condition: 'Reach Level 100 + unlock all trophies', tier: 'platinum' },
];

// ============================================================
// FORMATIONS (Squad Builder)
// ============================================================
export const SQUAD_SIZES = ['11v11','10v10','9v9','8v8','7v7','6v6','5v5','4v4','3v3','2v2'];
export const TEAM_PLAYSTYLES = ['Possession Game','Quick Counter','Long Ball Counter','Out Wide','Long Ball','Gegenpressing'];
export const TEAM_TACTICS = ['High Pressing','Low Block','Offside Trap','Wing Overload','False Nine','Inverted Fullbacks'];

// ============================================================
// FITNESS TIERS
// ============================================================
export function getFitnessTier(level: number) {
  if (level <= 20) return { name: 'Beginner', maxQuests: 3, priCutoff: 25, intensities: ['low', 'moderate'] as const };
  if (level <= 60) return { name: 'Intermediate', maxQuests: 4, priCutoff: 15, intensities: ['low', 'moderate', 'high'] as const };
  return { name: 'Elite', maxQuests: 5, priCutoff: 10, intensities: ['low', 'moderate', 'high'] as const };
}
