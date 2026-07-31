import { createContext, useState, useEffect, ReactNode } from 'react'
import {
  UserProfile,
  FoodItem,
  MealItemLog,
  WeightEntry,
  ProgressPhoto,
  Exercise,
  WorkoutRoutine,
  WorkoutSession,
  WaterLog,
  SleepLog,
  MealCategory,
} from '@/types/fitness'
import { INITIAL_USER, INITIAL_ROUTINES } from '@/data/mock-data'
import { EXPANDED_FOODS as DEFAULT_FOODS } from '@/data/foods-database'
import { EXPANDED_EXERCISES as DEFAULT_EXERCISES } from '@/data/exercises-database'
import { db } from '@/lib/db'

export interface FitnessContextType {
  user: UserProfile
  foods: FoodItem[]
  mealLogs: MealItemLog[]
  weightEntries: WeightEntry[]
  photos: ProgressPhoto[]
  exercises: Exercise[]
  routines: WorkoutRoutine[]
  sessions: WorkoutSession[]
  waterLogs: WaterLog[]
  sleepLogs: SleepLog[]
  isAuthenticated: boolean
  dbConnected: boolean
  login: (email: string) => void
  logout: () => void
  connectDb: (serverUrl: string) => void
  disconnectDb: () => void
  updateUserProfile: (data: Partial<UserProfile>) => void
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void
  addMealItem: (item: Omit<MealItemLog, 'id'>) => void
  removeMealItem: (id: string) => void
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void
  removeWeightEntry: (id: string) => void
  addProgressPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void
  addWaterLog: (amountMl: number) => void
  addSleepLog: (log: Omit<SleepLog, 'id'>) => void
  saveRoutine: (routine: WorkoutRoutine) => void
  deleteRoutine: (id: string) => void
  addWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => void
}

export const FitnessContext = createContext<FitnessContextType | undefined>(undefined)

const TODAY = new Date().toISOString().split('T')[0]

export const FitnessProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fit_auth') === 'true'
  })

  const [dbConnected, setDbConnected] = useState<boolean>(() => {
    return localStorage.getItem('fittrack_db_connected') === 'true'
  })

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fit_user')
    return saved ? JSON.parse(saved) : INITIAL_USER
  })

  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('fit_foods')
    const parsed = saved ? JSON.parse(saved) : null
    if (parsed && parsed.length >= 50) return parsed
    return DEFAULT_FOODS
  })

  const [mealLogs, setMealLogs] = useState<MealItemLog[]>(() => {
    const saved = localStorage.getItem('fit_meal_logs')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ml1',
            foodId: 'f1',
            foodName: 'Arroz Branco Cozido',
            mealCategory: 'almoço' as MealCategory,
            servings: 1.5,
            servingUnit: 'g',
            totalGrams: 150,
            calories: 195,
            proteinG: 4,
            carbsG: 42,
            fatG: 0.5,
            date: TODAY,
          },
          {
            id: 'ml2',
            foodId: 'f3',
            foodName: 'Peito de Frango Grelhado',
            mealCategory: 'almoço' as MealCategory,
            servings: 1.5,
            servingUnit: 'g',
            totalGrams: 150,
            calories: 247,
            proteinG: 46.5,
            carbsG: 0,
            fatG: 5.4,
            date: TODAY,
          },
          {
            id: 'ml3',
            foodId: 'f5',
            foodName: 'Banana Prata',
            mealCategory: 'cafédamanhã' as MealCategory,
            servings: 1,
            servingUnit: 'unidade',
            totalGrams: 100,
            calories: 89,
            proteinG: 1.1,
            carbsG: 23,
            fatG: 0.3,
            date: TODAY,
          },
        ]
  })

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('fit_weight')
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'w1', date: '2026-07-01', weightKg: 81.2, bodyFatPercentage: 21, leanMassKg: 64.1 },
          {
            id: 'w2',
            date: '2026-07-10',
            weightKg: 80.4,
            bodyFatPercentage: 20.3,
            leanMassKg: 64.0,
          },
          {
            id: 'w3',
            date: '2026-07-20',
            weightKg: 79.5,
            bodyFatPercentage: 19.8,
            leanMassKg: 63.8,
          },
          {
            id: 'w4',
            date: TODAY,
            weightKg: 78.5,
            bodyFatPercentage: 19.1,
            leanMassKg: 63.5,
            notes: 'Ótima evolução nas semanas recentes!',
          },
        ]
  })

  const [photos, setPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem('fit_photos')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'p1',
            date: '2026-07-01',
            type: 'front',
            imageUrl: 'https://img.usecurling.com/p/400/500?q=fitness%20body%20man',
            notes: 'Início do projeto',
          },
          {
            id: 'p2',
            date: TODAY,
            type: 'front',
            imageUrl: 'https://img.usecurling.com/p/400/500?q=athletic%20man%20abs',
            notes: '30 dias de evolução',
          },
        ]
  })

  const [exercises] = useState<Exercise[]>(DEFAULT_EXERCISES)

  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('fit_routines')
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES
  })

  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('fit_sessions')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 's1',
            routineId: 'r1',
            routineName: 'Treino A - Peito e Tríceps',
            date: TODAY,
            durationMinutes: 52,
            exercises: [
              {
                exerciseId: 'e1',
                exerciseName: 'Supino Reto com Barra',
                targetMuscle: 'Peitoral',
                sets: [
                  { setNumber: 1, reps: 10, weightKg: 65, completed: true },
                  { setNumber: 2, reps: 10, weightKg: 65, completed: true },
                ],
              },
            ],
          },
        ]
  })

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem('fit_water')
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'wt1', date: TODAY, amountMl: 500, timestamp: '08:30' },
          { id: 'wt2', date: TODAY, amountMl: 500, timestamp: '11:15' },
          { id: 'wt3', date: TODAY, amountMl: 300, timestamp: '14:00' },
        ]
  })

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    const saved = localStorage.getItem('fit_sleep')
    return saved
      ? JSON.parse(saved)
      : [{ id: 'sl1', date: TODAY, hoursSlept: 7.5, qualityStars: 4, notes: 'Sono reparador' }]
  })

  useEffect(() => {
    localStorage.setItem('fit_auth', isAuthenticated ? 'true' : 'false')
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('fit_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('fit_meal_logs', JSON.stringify(mealLogs))
  }, [mealLogs])

  useEffect(() => {
    localStorage.setItem('fit_weight', JSON.stringify(weightEntries))
  }, [weightEntries])

  useEffect(() => {
    localStorage.setItem('fit_routines', JSON.stringify(routines))
  }, [routines])

  useEffect(() => {
    localStorage.setItem('fit_sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('fit_water', JSON.stringify(waterLogs))
  }, [waterLogs])

  useEffect(() => {
    localStorage.setItem('fit_sleep', JSON.stringify(sleepLogs))
  }, [sleepLogs])

  useEffect(() => {
    localStorage.setItem('fit_foods', JSON.stringify(foods))
  }, [foods])

  useEffect(() => {
    localStorage.setItem('fit_photos', JSON.stringify(photos))
  }, [photos])

  const login = (email: string) => {
    setUser((prev) => ({ ...prev, email }))
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const connectDb = (serverUrl: string) => {
    db.connect(serverUrl)
    setDbConnected(true)
  }

  const disconnectDb = () => {
    db.disconnect()
    setDbConnected(false)
  }

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }))
  }

  const addCustomFood = (foodData: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = { ...foodData, id: `custom_${Date.now()}`, isCustom: true }
    setFoods((prev) => [newFood, ...prev])
  }

  const addMealItem = (itemData: Omit<MealItemLog, 'id'>) => {
    const newItem: MealItemLog = { ...itemData, id: `meal_${Date.now()}` }
    setMealLogs((prev) => [newItem, ...prev])
  }

  const removeMealItem = (id: string) => {
    setMealLogs((prev) => prev.filter((m) => m.id !== id))
  }

  const addWeightEntry = (entryData: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = { ...entryData, id: `w_${Date.now()}` }
    setWeightEntries((prev) =>
      [...prev.filter((e) => e.date !== newEntry.date), newEntry].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    )
    setUser((prev) => ({ ...prev, weightKg: entryData.weightKg }))
  }

  const removeWeightEntry = (id: string) => {
    setWeightEntries((prev) => prev.filter((w) => w.id !== id))
  }

  const addProgressPhoto = (photoData: Omit<ProgressPhoto, 'id'>) => {
    const newPhoto: ProgressPhoto = { ...photoData, id: `photo_${Date.now()}` }
    setPhotos((prev) => [newPhoto, ...prev])
  }

  const addWaterLog = (amountMl: number) => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newLog: WaterLog = { id: `wt_${Date.now()}`, date: TODAY, amountMl, timestamp: timeStr }
    setWaterLogs((prev) => [...prev, newLog])
  }

  const addSleepLog = (logData: Omit<SleepLog, 'id'>) => {
    const newLog: SleepLog = { ...logData, id: `sl_${Date.now()}` }
    setSleepLogs((prev) => [newLog, ...prev.filter((s) => s.date !== logData.date)])
  }

  const saveRoutine = (routine: WorkoutRoutine) => {
    setRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === routine.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = routine
        return copy
      }
      return [...prev, routine]
    })
  }

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  const addWorkoutSession = (sessionData: Omit<WorkoutSession, 'id'>) => {
    const newSession: WorkoutSession = { ...sessionData, id: `sess_${Date.now()}` }
    setSessions((prev) => [newSession, ...prev])
  }

  return (
    <FitnessContext.Provider
      value={{
        user,
        foods,
        mealLogs,
        weightEntries,
        photos,
        exercises,
        routines,
        sessions,
        waterLogs,
        sleepLogs,
        isAuthenticated,
        dbConnected,
        login,
        logout,
        connectDb,
        disconnectDb,
        updateUserProfile,
        addCustomFood,
        addMealItem,
        removeMealItem,
        addWeightEntry,
        removeWeightEntry,
        addProgressPhoto,
        addWaterLog,
        addSleepLog,
        saveRoutine,
        deleteRoutine,
        addWorkoutSession,
      }}
    >
      {children}
    </FitnessContext.Provider>
  )
}
