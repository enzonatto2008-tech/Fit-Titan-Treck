import { Button } from '@/components/ui/button'
import { Play, Pause, Plus, Square } from 'lucide-react'

interface RestTimerModalProps {
  timeLeft: number
  initialTime: number
  isActive: boolean
  progressPercent: number
  onPauseToggle: () => void
  onAdd30s: () => void
  onStop: () => void
}

export function RestTimerModal({
  timeLeft,
  progressPercent,
  onAdd30s,
  onStop,
}: RestTimerModalProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-card border border-emerald-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up">
      <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-accent text-emerald-500 font-bold text-sm">
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="28" cy="28" r="24" className="stroke-muted fill-none stroke-2" />
          <circle
            cx="28"
            cy="28"
            r="24"
            className="stroke-emerald-500 fill-none stroke-2 transition-all duration-300"
            strokeDasharray={150}
            strokeDashoffset={150 - (150 * progressPercent) / 100}
          />
        </svg>
        {formatTime(timeLeft)}
      </div>

      <div>
        <p className="text-xs font-semibold text-foreground">Tempo de Descanso</p>
        <p className="text-[11px] text-muted-foreground">Respire fundo para a próxima série!</p>
        <div className="flex gap-2 mt-2">
          <Button size="xs" variant="outline" onClick={onAdd30s} className="h-6 text-[10px] gap-1">
            <Plus className="h-3 w-3" /> +30s
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={onStop}
            className="h-6 text-[10px] text-red-400 hover:text-red-300"
          >
            <Square className="h-3 w-3" /> Pular
          </Button>
        </div>
      </div>
    </div>
  )
}
