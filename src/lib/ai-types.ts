import type {
  UserProfile,
  MealItemLog,
  WeightEntry,
  WaterLog,
  SleepLog,
  WorkoutSession,
  WorkoutRoutine,
  Exercise,
  FoodItem,
  Recipe,
} from '@/types/fitness'

export interface AIDataContext {
  user: UserProfile
  mealLogs: MealItemLog[]
  weightEntries: WeightEntry[]
  waterLogs: WaterLog[]
  sleepLogs: SleepLog[]
  sessions: WorkoutSession[]
  routines: WorkoutRoutine[]
  exercises: Exercise[]
  foods: FoodItem[]
}

export interface AISessionState {
  dataAuthorized: boolean
  pendingFlow: null | 'diet' | 'video_workout' | 'recipe'
  dietStep: number
  dietAnswers: Record<string, string>
  favoriteExercises: string[]
  favoriteFoods: string[]
  memory: string[]
}

export type AIAction =
  | { type: 'save_workout'; routine: WorkoutRoutine }
  | { type: 'save_recipe'; recipe: Omit<Recipe, 'id'> }

export interface AIResponse {
  text: string
  action?: AIAction
  quickActions?: string[]
}
