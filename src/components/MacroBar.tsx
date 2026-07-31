import { Progress } from '@/components/ui/progress'

interface MacroBarProps {
  label: string
  current: number
  target: number
  color: string
}

export function MacroBar({ label, current, target, color }: MacroBarProps) {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span>
          <strong className="text-foreground">{current}g</strong> / {target}g
        </span>
      </div>
      <Progress value={percent} className="h-1.5" />
    </div>
  )
}
