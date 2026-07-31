import { ReactNode } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  current: number
  target: number
  unit: string
  icon?: ReactNode
  colorClass?: string
  progressColor?: string
}

export function StatCard({
  title,
  current,
  target,
  unit,
  icon,
  colorClass = 'text-violet-500',
  progressColor,
}: StatCardProps) {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
  const isOver = current > target && title.toLowerCase().includes('caloria')

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-subtle hover:border-border/80 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className={cn('p-2 rounded-lg bg-accent/50', colorClass)}>{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">
            {current.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          meta: {target.toLocaleString('pt-BR')}
          {unit}
        </span>
      </div>

      <Progress
        value={percent}
        className={cn('h-2', isOver && 'bg-violet-800/20 [&>div]:bg-violet-800', progressColor)}
      />

      <div className="mt-2 flex justify-between items-center text-[11px] text-muted-foreground">
        <span>{percent}% concluído</span>
        {isOver && <span className="text-violet-800 font-semibold">Acima da meta</span>}
      </div>
    </div>
  )
}
