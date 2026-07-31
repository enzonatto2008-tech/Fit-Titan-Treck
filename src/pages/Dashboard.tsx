import { Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { StatCard } from '@/components/StatCard'
import { MacroBar } from '@/components/MacroBar'
import { Button } from '@/components/ui/button'
import { Flame, Dumbbell, Droplet, TrendingDown, ArrowUpRight, Sparkles } from 'lucide-react'

export default function Dashboard() {
  const { user, mealLogs, waterLogs, routines, weightEntries } = useFitness()
  const todayStr = new Date().toISOString().split('T')[0]

  const todayMeals = mealLogs.filter((m) => m.date === todayStr)
  const consumedCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0)
  const consumedProtein = todayMeals.reduce((acc, m) => acc + m.proteinG, 0)
  const consumedCarbs = todayMeals.reduce((acc, m) => acc + m.carbsG, 0)
  const consumedFat = todayMeals.reduce((acc, m) => acc + m.fatG, 0)

  const todayWater = waterLogs
    .filter((w) => w.date === todayStr)
    .reduce((acc, w) => acc + w.amountMl, 0)
  const activeRoutine = routines[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, {user.name} 👋</h1>
          <p className="text-xs text-muted-foreground">
            Aqui está o resumo do seu progresso diário em tempo real.
          </p>
        </div>
        <Link to="/ai">
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2 text-xs shadow-md"
          >
            <Sparkles className="h-4 w-4" /> Consultar IA Coach
          </Button>
        </Link>
      </div>

      {/* Top Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calorias Diárias"
          current={consumedCalories}
          target={user.dailyCaloriesTarget}
          unit="kcal"
          icon={<Flame className="h-4 w-4" />}
        />
        <StatCard
          title="Água Ingerida"
          current={todayWater}
          target={user.waterTargetMl}
          unit="ml"
          colorClass="text-purple-500"
          icon={<Droplet className="h-4 w-4" />}
        />
        <StatCard
          title="Peso Atual"
          current={user.weightKg}
          target={user.goalWeightKg}
          unit="kg"
          colorClass="text-fuchsia-500"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-subtle flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Macronutrientes
          </span>
          <MacroBar
            label="Proteínas"
            current={consumedProtein}
            target={user.proteinTargetG}
            color="bg-violet-500"
          />
          <MacroBar
            label="Carboidratos"
            current={consumedCarbs}
            target={user.carbsTargetG}
            color="bg-purple-400"
          />
          <MacroBar
            label="Gorduras"
            current={consumedFat}
            target={user.fatTargetG}
            color="bg-fuchsia-500"
          />
        </div>
      </div>

      {/* Mid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-violet-500" /> Treino Recomendado para Hoje
            </h2>
            <Link
              to="/treinos"
              className="text-xs text-violet-500 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {activeRoutine ? (
            <div className="p-4 rounded-xl bg-accent/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-violet-500 uppercase tracking-wider">
                  Disponível
                </span>
                <h3 className="font-semibold text-lg">{activeRoutine.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeRoutine.exercises.length} exercícios programados
                </p>
              </div>
              <Link to={`/treinos/executar/${activeRoutine.id}`}>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2">
                  Iniciar Treino Agora
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhum treino agendado. Crie uma rotina na aba Treinos.
            </p>
          )}
        </div>

        {/* Weight Sparkline / Goal Status */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-bold">Resumo da Meta</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Objetivo:</span>
              <strong className="capitalize">{user.fitnessGoal.replace('_', ' ')}</strong>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Peso Inicial -&gt; Meta:</span>
              <strong>
                {weightEntries[0]?.weightKg || user.weightKg}kg → {user.goalWeightKg}kg
              </strong>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Treinos Semanais:</span>
              <strong>Target: {user.weeklyWorkoutsTarget}x/sem</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meals Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Refeições Registradas Hoje</h2>
          <Link to="/refeicoes" className="text-xs text-violet-500 hover:underline">
            Gerenciar Refeições
          </Link>
        </div>

        {todayMeals.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum alimento registrado hoje ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayMeals.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-lg border border-border bg-accent/20 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-semibold capitalize text-foreground">{m.foodName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.mealCategory} • {m.totalGrams}g
                  </p>
                </div>
                <span className="font-bold text-violet-500">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
