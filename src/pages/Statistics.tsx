import { useFitness } from '@/hooks/use-fitness'
import { useGamification } from '@/hooks/use-gamification'
import { Card } from '@/components/ui/card'
import { AchievementBadge } from '@/components/AchievementBadge'
import { Trophy, Clock, TrendingDown, Flame, Dumbbell, Zap, Award } from 'lucide-react'
import { WeightChart } from '@/components/WeightChart'

export default function Statistics() {
  const { sessions, weightEntries, mealLogs } = useFitness()
  const gamification = useGamification()

  const totalMinutes = sessions.reduce((a, s) => a + s.durationMinutes, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const weightChange =
    weightEntries.length > 1
      ? (weightEntries[weightEntries.length - 1].weightKg - weightEntries[0].weightKg).toFixed(1)
      : '0'
  const totalCalories = mealLogs.reduce((a, m) => a + m.calories, 0)

  const personalRecords: { exercise: string; maxWeight: number }[] = []
  sessions.forEach((s) => {
    s.exercises.forEach((ex) => {
      const maxW = Math.max(...ex.sets.map((set) => set.weightKg), 0)
      const existing = personalRecords.find((p) => p.exercise === ex.exerciseName)
      if (!existing && maxW > 0) {
        personalRecords.push({ exercise: ex.exerciseName, maxWeight: maxW })
      } else if (existing && maxW > existing.maxWeight) {
        existing.maxWeight = maxW
      }
    })
  })

  const stats = [
    { label: 'Treinos Totais', value: sessions.length, icon: Dumbbell, color: 'text-violet-500' },
    { label: 'Horas Treinadas', value: `${totalHours}h`, icon: Clock, color: 'text-purple-500' },
    {
      label: 'Mudança de Peso',
      value: `${weightChange}kg`,
      icon: TrendingDown,
      color: 'text-fuchsia-500',
    },
    {
      label: 'Calorias Consumidas',
      value: totalCalories.toLocaleString('pt-BR'),
      icon: Flame,
      color: 'text-pink-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estatísticas & Conquistas</h1>
        <p className="text-xs text-muted-foreground">
          Acompanhe sua jornada de evolução com métricas detalhadas e gamificação.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 border-border space-y-2">
            <div className={`p-2 rounded-lg bg-accent/50 w-fit ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-border space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Zap className="h-4 w-4 text-violet-500" /> Gamificação & Progressão
        </h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div>
            <p className="text-xs text-muted-foreground">Nível Atual</p>
            <p className="text-3xl font-bold text-violet-500">{gamification.level}</p>
          </div>
          <div className="flex-1 mx-6">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{gamification.xp} XP total</span>
              <span className="text-violet-500 font-semibold">
                {gamification.xpToNextLevel} XP p/ próximo nível
              </span>
            </div>
            <div className="h-3 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-purple-400 transition-all duration-500"
                style={{ width: `${gamification.levelProgress}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Conquistas</p>
            <p className="text-2xl font-bold">
              {gamification.unlockedCount}/{gamification.achievements.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gamification.achievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}
        </div>
      </Card>

      <Card className="p-6 border-border space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-violet-500" /> Evolução de Peso
        </h2>
        <WeightChart entries={weightEntries} />
      </Card>

      {personalRecords.length > 0 && (
        <Card className="p-6 border-border space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" /> Recordes Pessoais (PRs)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {personalRecords.map((pr) => (
              <div
                key={pr.exercise}
                className="flex justify-between items-center p-3 rounded-lg bg-accent/30 text-xs"
              >
                <span className="font-medium flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  {pr.exercise}
                </span>
                <span className="font-bold text-violet-500">{pr.maxWeight} kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
