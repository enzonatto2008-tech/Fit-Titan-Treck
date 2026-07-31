import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, Plus } from 'lucide-react'

export default function Water() {
  const { user, waterLogs, addWaterLog } = useFitness()
  const todayStr = new Date().toISOString().split('T')[0]

  const todayWater = waterLogs
    .filter((w) => w.date === todayStr)
    .reduce((acc, w) => acc + w.amountMl, 0)
  const percent = Math.min(100, Math.round((todayWater / user.waterTargetMl) * 100))

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hidratação Diária</h1>
        <p className="text-xs text-muted-foreground">
          Acompanhe seu consumo de água e garanta o máximo rendimento físico.
        </p>
      </div>

      <Card className="p-8 border-border flex flex-col items-center text-center space-y-6">
        <div className="relative flex items-center justify-center h-40 w-40 rounded-full bg-blue-500/10 text-blue-500 font-bold text-2xl">
          <Droplet className="h-10 w-10 text-blue-500 mb-1" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold">{todayWater} ml</span>
            <span className="text-[11px] text-muted-foreground">Meta: {user.waterTargetMl} ml</span>
          </div>
        </div>

        <div className="w-full bg-accent h-3 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          <Button
            onClick={() => addWaterLog(200)}
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10 text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> +200 ml
          </Button>
          <Button
            onClick={() => addWaterLog(300)}
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10 text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> +300 ml
          </Button>
          <Button
            onClick={() => addWaterLog(500)}
            variant="outline"
            className="border-blue-500/30 hover:bg-blue-500/10 text-xs gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> +500 ml
          </Button>
        </div>
      </Card>
    </div>
  )
}
