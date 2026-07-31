import { useMemo } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Sparkles, Droplet, Dumbbell, TrendingDown, Flame } from 'lucide-react'

export function DailyMotivation() {
  const { user, mealLogs, waterLogs, sessions, weightEntries } = useFitness()
  const today = new Date().toISOString().split('T')[0]

  const message = useMemo(() => {
    const todayMeals = mealLogs.filter((m) => m.date === today)
    const todayCals = todayMeals.reduce((a, m) => a + m.calories, 0)
    const todayWater = waterLogs.filter((w) => w.date === today).reduce((a, w) => a + w.amountMl, 0)
    const waterRem = user.waterTargetMl - todayWater

    const msgs: { icon: typeof Sparkles; text: string; color: string }[] = []

    if (waterRem > 0 && waterRem <= 500) {
      msgs.push({
        icon: Droplet,
        text: `Faltam apenas ${waterRem}ml de água para sua meta diária! 💧`,
        color: 'text-blue-500',
      })
    }
    if (todayMeals.length === 0) {
      msgs.push({
        icon: Flame,
        text: 'Você ainda não registrou refeições hoje. Que tal começar agora?',
        color: 'text-orange-500',
      })
    }
    if (weightEntries.length >= 2) {
      const diff = weightEntries[0].weightKg - weightEntries[weightEntries.length - 1].weightKg
      if (diff > 0)
        msgs.push({
          icon: TrendingDown,
          text: `Você já perdeu ${diff.toFixed(1)}kg desde o início! Continue assim! 🎯`,
          color: 'text-green-500',
        })
    }
    if (sessions.length > 0) {
      msgs.push({
        icon: Dumbbell,
        text: `Você já completou ${sessions.length} treinos. Continue firme! 💪`,
        color: 'text-violet-500',
      })
    }
    if (todayCals > 0 && user.dailyCaloriesTarget - todayCals < 300) {
      msgs.push({
        icon: Flame,
        text: 'Você está perto de sua meta calórica de hoje!',
        color: 'text-orange-500',
      })
    }
    if (msgs.length === 0) {
      msgs.push({
        icon: Sparkles,
        text: 'Hoje é um novo dia para evoluir! Comece registrando suas atividades.',
        color: 'text-violet-500',
      })
    }

    return msgs[0]
  }, [user, mealLogs, waterLogs, sessions, weightEntries, today])

  const Icon = message.icon

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 animate-fade-in">
      <div className={cnIcon(message.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-foreground">{message.text}</p>
    </div>
  )
}

function cnIcon(color: string) {
  return `h-10 w-10 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0 ${color}`
}
