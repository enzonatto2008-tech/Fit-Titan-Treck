import { Achievement } from '@/types/fitness'
import { cn } from '@/lib/utils'

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all',
        achievement.unlocked
          ? 'border-violet-500/30 bg-violet-500/10 hover:scale-105'
          : 'border-border bg-muted/50 opacity-50 grayscale',
      )}
    >
      <span className="text-3xl">{achievement.icon}</span>
      <span className="text-xs font-bold">{achievement.name}</span>
      <span className="text-[10px] text-muted-foreground leading-tight">
        {achievement.description}
      </span>
      {achievement.unlocked && (
        <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wider">
          ✓ Desbloqueado
        </span>
      )}
    </div>
  )
}
