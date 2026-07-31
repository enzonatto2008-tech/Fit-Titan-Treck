export type Gender = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type FitnessGoal = 'weight_loss' | 'maintenance' | 'muscle_gain'

export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  gender: Gender
  heightCm: number
  weightKg: number
  goalWeightKg: number
  activityLevel: ActivityLevel
  fitnessGoal: FitnessGoal
  tmb: number
  dailyCaloriesTarget: number
  proteinTargetG: number
  carbsTargetG: number
  fatTargetG: number
  waterTargetMl: number
  weeklyWorkoutsTarget: number
  isSetupCompleted: boolean
}

export interface FoodItem {
  id: string
  name: string
  category?: string
  servingSizeG: number
  servingUnit: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG?: number
  sodiumMg?: number
  isCustom?: boolean
}

export type MealCategory =
  | 'cafédamanhã'
  | 'lanche'
  | 'almoço'
  | 'prétreino'
  | 'póstreino'
  | 'jantar'
  | 'ceia'

export interface MealItemLog {
  id: string
  foodId: string
  foodName: string
  mealCategory: MealCategory
  servings: number
  servingUnit: string
  totalGrams: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  date: string
}

export interface WeightEntry {
  id: string
  date: string
  weightKg: number
  bodyFatPercentage?: number
  leanMassKg?: number
  waistCm?: number
  notes?: string
}

export interface ProgressPhoto {
  id: string
  date: string
  type: 'front' | 'side' | 'back'
  imageUrl: string
  notes?: string
}

export interface Exercise {
  id: string
  name: string
  targetMuscle: string
  defaultSets: number
  defaultReps: number
  defaultWeightKg: number
  defaultRestSeconds: number
}

export interface RoutineExercise {
  exerciseId: string
  name: string
  targetMuscle: string
  sets: number
  reps: number
  weightKg: number
  restSeconds: number
}

export interface WorkoutRoutine {
  id: string
  name: string
  description?: string
  exercises: RoutineExercise[]
}

export interface SessionExerciseSet {
  setNumber: number
  reps: number
  weightKg: number
  completed: boolean
}

export interface SessionExerciseLog {
  exerciseId: string
  exerciseName: string
  targetMuscle: string
  sets: SessionExerciseSet[]
}

export interface WorkoutSession {
  id: string
  routineId: string
  routineName: string
  date: string
  durationMinutes: number
  exercises: SessionExerciseLog[]
}

export interface WaterLog {
  id: string
  date: string
  amountMl: number
  timestamp: string
}

export interface SleepLog {
  id: string
  date: string
  hoursSlept: number
  qualityStars: number
  notes?: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

export interface Recipe {
  id: string
  name: string
  mealType: string
  description: string
  ingredients: string[]
  steps: string[]
  prepTimeMinutes: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG: number
  servings: number
  isFavorite?: boolean
  isCustom?: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export type ReminderType = 'water' | 'meal' | 'workout' | 'sleep' | 'weigh_in'

export interface Reminder {
  id: string
  type: ReminderType
  title: string
  time: string
  days: number[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  timestamp: string
  read: boolean
}
