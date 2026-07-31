import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { useRestTimer } from '@/hooks/use-rest-timer'
import { RestTimerModal } from '@/components/RestTimerModal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function WorkoutSession() {
  const { routineId } = useParams()
  const { routines, addWorkoutSession } = useFitness()
  const navigate = useNavigate()

  const routine = routines.find((r) => r.id === routineId) || routines[0]
  const restTimer = useRestTimer()

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleSet = (key: string, restSecs: number) => {
    const nextState = !completedSets[key]
    setCompletedSets((prev) => ({ ...prev, [key]: nextState }))
    if (nextState) {
      restTimer.startTimer(restSecs)
    }
  }

  const handleFinish = () => {
    const today = new Date().toISOString().split('T')[0]
    addWorkoutSession({
      routineId: routine.id,
      routineName: routine.name,
      date: today,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      exercises: routine.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.name,
        targetMuscle: ex.targetMuscle,
        sets: Array.from({ length: ex.sets }).map((_, idx) => ({
          setNumber: idx + 1,
          reps: ex.reps,
          weightKg: ex.weightKg,
          completed: !!completedSets[`${ex.exerciseId}_${idx}`],
        })),
      })),
    })

    navigate('/treinos/historico')
  }

  const formatElapsedTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/treinos')}
          className="gap-1 text-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold">{routine.name}</h1>
          <span className="text-xs text-violet-500 font-mono font-bold">
            Tempo: {formatElapsedTime(elapsedSeconds)}
          </span>
        </div>
        <Button
          onClick={handleFinish}
          className="bg-violet-600 hover:bg-violet-700 text-white size-sm gap-1 text-xs"
        >
          <CheckCircle2 className="h-4 w-4" /> Finalizar
        </Button>
      </div>

      <div className="space-y-4">
        {routine.exercises.map((ex) => (
          <Card key={ex.exerciseId} className="p-4 border-border space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold">{ex.name}</h2>
                <span className="text-[11px] text-muted-foreground">
                  {ex.targetMuscle} • Descanso: {ex.restSeconds}s
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {Array.from({ length: ex.sets }).map((_, idx) => {
                const key = `${ex.exerciseId}_${idx}`
                const isChecked = !!completedSets[key]

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-accent/30 text-xs"
                  >
                    <span>Série {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <Input defaultValue={ex.reps} className="w-12 h-7 text-center text-xs" /> reps
                      <Input
                        defaultValue={ex.weightKg}
                        className="w-16 h-7 text-center text-xs"
                      />{' '}
                      kg
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleSet(key, ex.restSeconds)}
                        className="h-5 w-5 border-violet-500"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {restTimer.isActive && (
        <RestTimerModal
          timeLeft={restTimer.timeLeft}
          initialTime={restTimer.initialTime}
          isActive={restTimer.isActive}
          progressPercent={restTimer.progressPercent}
          onPauseToggle={() => {}}
          onAdd30s={() => restTimer.addTime(30)}
          onStop={restTimer.stopTimer}
        />
      )}
    </div>
  )
}
