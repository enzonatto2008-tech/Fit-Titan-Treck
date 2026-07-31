import { useMemo } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Achievement } from '@/types/fitness'

export function useGamification() {
  const { sessions, mealLogs, waterLogs, weightEntries } = useFitness()

  const xp = useMemo(() => {
    return (
      sessions.length * 50 + mealLogs.length * 5 + waterLogs.length * 2 + weightEntries.length * 10
    )
  }, [sessions, mealLogs, waterLogs, weightEntries])

  const level = Math.floor(xp / 100) + 1
  const xpInLevel = xp % 100
  const xpToNextLevel = 100 - xpInLevel
  const levelProgress = (xpInLevel / 100) * 100

  const achievements: Achievement[] = useMemo(() => {
    return [
      {
        id: 'first_workout',
        name: 'Primeiro Passo',
        description: 'Complete seu primeiro treino',
        icon: '🎯',
        unlocked: sessions.length >= 1,
      },
      {
        id: 'consistent',
        name: 'Consistente',
        description: 'Complete 5 treinos',
        icon: '💪',
        unlocked: sessions.length >= 5,
      },
      {
        id: 'dedicated',
        name: 'Dedicado',
        description: 'Complete 20 treinos',
        icon: '🔥',
        unlocked: sessions.length >= 20,
      },
      {
        id: 'nutrition_tracker',
        name: 'Nutricionista',
        description: 'Registre 10 refeições',
        icon: '🥗',
        unlocked: mealLogs.length >= 10,
      },
      {
        id: 'hydrated',
        name: 'Hidratado',
        description: 'Registre 30 logs de água',
        icon: '💧',
        unlocked: waterLogs.length >= 30,
      },
      {
        id: 'weight_tracker',
        name: 'Monitor',
        description: 'Registre 5 pesos',
        icon: '⚖️',
        unlocked: weightEntries.length >= 5,
      },
      {
        id: 'early_bird',
        name: 'Madrugador',
        description: 'Treine antes das 8h',
        icon: '🌅',
        unlocked: sessions.some(
          (s) => s.date.includes('T') && parseInt(s.date.split('T')[1]?.split(':')[0] || '12') < 8,
        ),
      },
      {
        id: 'master',
        name: 'Mestre FTT',
        description: 'Acumule 1000 XP',
        icon: '👑',
        unlocked: xp >= 1000,
      },
    ]
  }, [sessions, mealLogs, waterLogs, weightEntries, xp])

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return { xp, level, xpInLevel, xpToNextLevel, levelProgress, achievements, unlockedCount }
}
