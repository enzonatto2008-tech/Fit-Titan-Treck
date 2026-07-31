import { Link } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Play, Trash2 } from 'lucide-react'

export default function Workouts() {
  const { routines, deleteRoutine } = useFitness()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rotinas de Treino</h1>
          <p className="text-xs text-muted-foreground">
            Gerencie suas divisões de treino e acompanhe a evolução de cargas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <Card
            key={routine.id}
            className="p-5 border-border flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500 uppercase">Divisão</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteRoutine(routine.id)}
                  className="h-6 w-6 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <h2 className="text-base font-bold">{routine.name}</h2>
              <p className="text-xs text-muted-foreground">{routine.description}</p>

              <div className="pt-2 space-y-1.5">
                {routine.exercises.map((ex) => (
                  <div
                    key={ex.exerciseId}
                    className="flex justify-between text-xs p-1.5 rounded bg-accent/40"
                  >
                    <span className="font-medium">{ex.name}</span>
                    <span className="text-muted-foreground">
                      {ex.sets}x{ex.reps} @ {ex.weightKg}kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link to={`/treinos/executar/${routine.id}`} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs">
                <Play className="h-3.5 w-3.5" /> Iniciar Treino
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
