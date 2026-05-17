export interface WorkoutDay {
  category: string;
  duration: number; // minutes
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }>;
}

export interface NutritionMeal {
  name: string;
  timing: string;
  calories: number;
  macros: {
    protein: number; // grams
    carbs: number;
    fats: number;
  };
  foods: string[];
}

export interface LegendaryPlayer {
  id: string;
  name: string;
  position: string;
  nationality: string;
  achievements: string[];
  workoutSplit: Record<string, WorkoutDay>; // day -> workout
  dailyCalories: number;
  nutrition: NutritionMeal[];
  keyStats: {
    label: string;
    value: string;
  }[];
  quote: string;
}

export const LEGENDARY_PLAYERS: LegendaryPlayer[] = [
  {
    id: 'cr7',
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    nationality: 'Portugal',
    achievements: ['5x Ballon d\'Or', 'Champion\'s League Record Goalscorer', '850+ Career Goals'],
    workoutSplit: {
      Monday: {
        category: 'Upper Body Strength',
        duration: 90,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '5-8', notes: 'Heavy compound' },
          { name: 'Weighted Dips', sets: 4, reps: '8-10' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10' },
          { name: 'Barbell Rows', sets: 4, reps: '6-8' },
          { name: 'Pull-ups', sets: 3, reps: '10-15', notes: 'Explosive' },
        ],
      },
      Tuesday: {
        category: 'Cardio & Agility',
        duration: 60,
        exercises: [
          { name: 'Sprint Intervals', sets: 6, reps: '30s on, 90s off' },
          { name: 'Ladder Drills', sets: 5, reps: '20m each' },
          { name: 'Cone Agility Work', sets: 4, reps: '5 cones' },
          { name: 'Recovery Jog', sets: 1, reps: '10 min easy pace' },
        ],
      },
      Wednesday: {
        category: 'Lower Body Power',
        duration: 90,
        exercises: [
          { name: 'Back Squats', sets: 4, reps: '5-6', notes: 'Heavy load' },
          { name: 'Romanian Deadlifts', sets: 4, reps: '8-10' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each' },
          { name: 'Leg Press', sets: 3, reps: '10-12' },
          { name: 'Calf Raises', sets: 4, reps: '15-20' },
        ],
      },
      Thursday: {
        category: 'Ball Work & Skill',
        duration: 90,
        exercises: [
          { name: 'Possession Drills', sets: 1, reps: '30 min' },
          { name: 'Finishing Drills', sets: 1, reps: '20 min' },
          { name: 'Free Kick Practice', sets: 1, reps: '15 min' },
          { name: 'Small Sided Game', sets: 1, reps: '30 min' },
        ],
      },
      Friday: {
        category: 'Flexibility & Core',
        duration: 60,
        exercises: [
          { name: 'Dynamic Stretching', sets: 1, reps: '10 min' },
          { name: 'Ab Circuit', sets: 3, reps: '30s each' },
          { name: 'Planks & Side Planks', sets: 3, reps: '60s' },
          { name: 'Yoga Flow', sets: 1, reps: '20 min' },
          { name: 'Ice Bath Recovery', sets: 1, reps: '10 min' },
        ],
      },
      Saturday: {
        category: 'Match Day',
        duration: 120,
        exercises: [
          { name: 'Light Warm-up', sets: 1, reps: '20 min' },
          { name: 'Tactical Drills', sets: 1, reps: '30 min' },
          { name: 'Full Match', sets: 1, reps: '90 min' },
        ],
      },
      Sunday: {
        category: 'Active Recovery',
        duration: 45,
        exercises: [
          { name: 'Light Walk', sets: 1, reps: '30 min' },
          { name: 'Stretching Routine', sets: 1, reps: '15 min' },
        ],
      },
    },
    dailyCalories: 3500,
    nutrition: [
      {
        name: 'Breakfast',
        timing: '7:00 AM',
        calories: 850,
        macros: { protein: 40, carbs: 100, fats: 15 },
        foods: ['Egg white omelette (6 eggs)', 'Whole grain toast', 'Berries', 'Olive oil'],
      },
      {
        name: 'Mid-Morning Snack',
        timing: '10:00 AM',
        calories: 400,
        macros: { protein: 30, carbs: 40, fats: 8 },
        foods: ['Protein shake', 'Banana', 'Almonds'],
      },
      {
        name: 'Lunch',
        timing: '1:00 PM',
        calories: 900,
        macros: { protein: 60, carbs: 90, fats: 12 },
        foods: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli', 'Olive oil'],
      },
      {
        name: 'Pre-Training Snack',
        timing: '4:00 PM',
        calories: 350,
        macros: { protein: 15, carbs: 55, fats: 5 },
        foods: ['White bread sandwich', 'Turkey slice', 'Honey'],
      },
      {
        name: 'Dinner',
        timing: '7:00 PM',
        calories: 800,
        macros: { protein: 50, carbs: 75, fats: 10 },
        foods: ['Grilled fish fillet', 'Sweet potato', 'Green salad', 'Lemon dressing'],
      },
      {
        name: 'Evening Supplement',
        timing: '10:00 PM',
        calories: 200,
        macros: { protein: 25, carbs: 5, fats: 3 },
        foods: ['Casein protein shake'],
      },
    ],
    keyStats: [
      { label: 'Career Goals', value: '850+' },
      { label: 'Ballon d\'Or', value: '5' },
      { label: 'Free Kicks', value: '60+' },
      { label: 'International Caps', value: '200+' },
    ],
    quote: 'The only way to do great work is to love what you do.',
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    position: 'Forward',
    nationality: 'Argentina',
    achievements: ['8x Ballon d\'Or', 'Copa América Champion', '800+ Career Goals'],
    workoutSplit: {
      Monday: {
        category: 'Technical Skills & Ball Work',
        duration: 90,
        exercises: [
          { name: 'Dribbling Drills', sets: 1, reps: '30 min' },
          { name: 'Passing Accuracy', sets: 1, reps: '25 min' },
          { name: 'Shooting Practice', sets: 1, reps: '20 min' },
          { name: 'Small Sided Game', sets: 1, reps: '15 min' },
        ],
      },
      Tuesday: {
        category: 'Explosive Power & Speed',
        duration: 75,
        exercises: [
          { name: 'Box Jumps', sets: 5, reps: '6', notes: 'Explosive' },
          { name: 'Sprint Intervals', sets: 6, reps: '20s on, 40s off' },
          { name: 'Single Leg Squats', sets: 3, reps: '8 each' },
          { name: 'Bounding Exercises', sets: 4, reps: '10m each' },
        ],
      },
      Wednesday: {
        category: 'Core Stability & Flexibility',
        duration: 60,
        exercises: [
          { name: 'Pilates Core Work', sets: 1, reps: '30 min' },
          { name: 'Dynamic Stretching', sets: 1, reps: '15 min' },
          { name: 'Balance Work', sets: 1, reps: '15 min' },
        ],
      },
      Thursday: {
        category: 'Tactical Possession',
        duration: 90,
        exercises: [
          { name: 'Possession Drills', sets: 1, reps: '40 min' },
          { name: 'One-Touch Passing', sets: 1, reps: '20 min' },
          { name: 'Free Play', sets: 1, reps: '30 min' },
        ],
      },
      Friday: {
        category: 'Light Recovery & Mobility',
        duration: 45,
        exercises: [
          { name: 'Foam Rolling', sets: 1, reps: '15 min' },
          { name: 'Yoga', sets: 1, reps: '30 min' },
        ],
      },
      Saturday: {
        category: 'Match Day',
        duration: 120,
        exercises: [
          { name: 'Pre-match Warm-up', sets: 1, reps: '30 min' },
          { name: 'Full Match', sets: 1, reps: '90 min' },
        ],
      },
      Sunday: {
        category: 'Complete Rest',
        duration: 0,
        exercises: [],
      },
    },
    dailyCalories: 3200,
    nutrition: [
      {
        name: 'Breakfast',
        timing: '8:00 AM',
        calories: 700,
        macros: { protein: 35, carbs: 80, fats: 12 },
        foods: ['Oatmeal', 'Banana', 'Berries', 'Honey', 'Greek yogurt'],
      },
      {
        name: 'Mid-Morning Snack',
        timing: '11:00 AM',
        calories: 300,
        macros: { protein: 25, carbs: 30, fats: 6 },
        foods: ['Protein bar', 'Apple', 'Nuts'],
      },
      {
        name: 'Lunch',
        timing: '1:00 PM',
        calories: 850,
        macros: { protein: 50, carbs: 100, fats: 10 },
        foods: ['Pasta with tomato sauce', 'Lean beef', 'Vegetables'],
      },
      {
        name: 'Pre-Training',
        timing: '4:00 PM',
        calories: 350,
        macros: { protein: 12, carbs: 60, fats: 4 },
        foods: ['Rice cake', 'Jam', 'Banana'],
      },
      {
        name: 'Dinner',
        timing: '7:00 PM',
        calories: 750,
        macros: { protein: 45, carbs: 70, fats: 12 },
        foods: ['Chicken breast', 'Rice', 'Steamed vegetables'],
      },
      {
        name: 'Bedtime Snack',
        timing: '9:30 PM',
        calories: 250,
        macros: { protein: 20, carbs: 10, fats: 8 },
        foods: ['Almonds', 'Natural almond butter'],
      },
    ],
    keyStats: [
      { label: 'Career Goals', value: '800+' },
      { label: 'Ballon d\'Or', value: '8' },
      { label: 'Assists', value: '200+' },
      { label: 'Trophies', value: '45+' },
    ],
    quote: 'I always thought that records were for breaking. The main thing is to focus on what you do best.',
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    position: 'Forward',
    nationality: 'Norway',
    achievements: ['60 Goals in 89 Games', 'Golden Boot Winner', 'Premier League Top Scorer'],
    workoutSplit: {
      Monday: {
        category: 'Explosive Strength',
        duration: 90,
        exercises: [
          { name: 'Heavy Squats', sets: 5, reps: '3-5', notes: 'Power development' },
          { name: 'Deadlifts', sets: 4, reps: '5-6' },
          { name: 'Explosive Push-ups', sets: 3, reps: '8-10' },
          { name: 'Sled Push', sets: 4, reps: '30m fast' },
        ],
      },
      Tuesday: {
        category: 'Finishing & Ball Skills',
        duration: 90,
        exercises: [
          { name: 'Finishing Drills', sets: 1, reps: '40 min' },
          { name: 'Headers Practice', sets: 1, reps: '20 min' },
          { name: 'One-on-one Drills', sets: 1, reps: '20 min' },
          { name: 'Tactical Positioning', sets: 1, reps: '10 min' },
        ],
      },
      Wednesday: {
        category: 'Speed & Agility',
        duration: 75,
        exercises: [
          { name: 'Flying Sprints', sets: 6, reps: '30m', notes: 'Max velocity' },
          { name: 'Change of Direction', sets: 5, reps: 'Cone drills' },
          { name: 'Plyometrics', sets: 4, reps: '10 reps' },
        ],
      },
      Thursday: {
        category: 'Match Simulation',
        duration: 90,
        exercises: [
          { name: 'Small Sided Games', sets: 1, reps: '60 min' },
          { name: 'Tactical Play', sets: 1, reps: '20 min' },
          { name: 'Decision Making', sets: 1, reps: '10 min' },
        ],
      },
      Friday: {
        category: 'Injury Prevention & Mobility',
        duration: 60,
        exercises: [
          { name: 'Mobility Work', sets: 1, reps: '20 min' },
          { name: 'Injury Prevention', sets: 1, reps: '20 min' },
          { name: 'Recovery Stretching', sets: 1, reps: '20 min' },
        ],
      },
      Saturday: {
        category: 'Match Day',
        duration: 120,
        exercises: [
          { name: 'Pre-match Activation', sets: 1, reps: '25 min' },
          { name: 'Full Match', sets: 1, reps: '90 min' },
        ],
      },
      Sunday: {
        category: 'Active Recovery',
        duration: 30,
        exercises: [
          { name: 'Light Swimming', sets: 1, reps: '20 min' },
          { name: 'Massage & Recovery', sets: 1, reps: '10 min' },
        ],
      },
    },
    dailyCalories: 4200,
    nutrition: [
      {
        name: 'Breakfast',
        timing: '7:30 AM',
        calories: 950,
        macros: { protein: 45, carbs: 120, fats: 15 },
        foods: ['Eggs (4)', 'Oatmeal', 'Almonds', 'Orange juice'],
      },
      {
        name: 'Snack 1',
        timing: '10:00 AM',
        calories: 400,
        macros: { protein: 30, carbs: 45, fats: 8 },
        foods: ['Protein shake', 'Banana', 'Peanut butter'],
      },
      {
        name: 'Lunch',
        timing: '1:00 PM',
        calories: 1000,
        macros: { protein: 70, carbs: 120, fats: 15 },
        foods: ['Salmon fillet', 'Basmati rice', 'Vegetables', 'Olive oil'],
      },
      {
        name: 'Pre-Training',
        timing: '4:00 PM',
        calories: 450,
        macros: { protein: 20, carbs: 70, fats: 6 },
        foods: ['Pasta', 'Chicken', 'Sports drink'],
      },
      {
        name: 'Dinner',
        timing: '7:30 PM',
        calories: 900,
        macros: { protein: 60, carbs: 100, fats: 12 },
        foods: ['Lean beef', 'Sweet potato', 'Broccoli', 'Avocado'],
      },
      {
        name: 'Evening Shake',
        timing: '10:00 PM',
        calories: 500,
        macros: { protein: 40, carbs: 50, fats: 10 },
        foods: ['Casein shake', 'Whole milk', 'Berries'],
      },
    ],
    keyStats: [
      { label: 'Goals per Game', value: '0.67' },
      { label: 'Fastest to 50 Goals', value: '64 games' },
      { label: 'Strength', value: 'Exceptional' },
      { label: 'Pace', value: '35.4 km/h' },
    ],
    quote: 'I want to be the best. That\'s the mindset every day.',
  },
];
