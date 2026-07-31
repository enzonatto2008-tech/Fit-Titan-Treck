import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Trophy, Calendar } from 'lucide-react'

export default function WorkoutHistory() {
  const { sessions } = useFitness()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Histórico de Treinos & Recordes</h1>
        <p className="text-xs text-muted-foreground">
          Registre cada sessão realizada e veja sua evolução contínua.
        </p>
      </div>

      {/* PR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border flex items-center gap-3">
          <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Carga Máxima (Supino)</span>
            <strong className="text-lg font-bold">65 kg</strong>
          </div>
        </Card>
        <Card className="p-4 border-border flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">
              Carga Máxima (Agachamento)
            </span>
            <strong className="text-lg font-bold">85 kg</strong>
          </div>
        </Card>
        <Card className="p-4 border-border flex items-center gap-3">
          <div className="p-3 bg-fuchsia-500/10 text-fuchsia-500 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Sessões Concluídas</span>
            <strong className="text-lg font-bold">{sessions.length} treinos</strong>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold">Sessões Recentes</h2>
        {sessions.map((s) => (
          <Card key={s.id} className="p-4 border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-violet-500 text-sm">{s.routineName}</span>
              <span className="text-muted-foreground">
                {s.date} • {s.durationMinutes} min
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {s.exercises.map((e) => `${e.exerciseName} (${e.sets.length} séries)`).join(', ')}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
