import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Moon, Star, Plus } from 'lucide-react'

export default function Sleep() {
  const { sleepLogs, addSleepLog } = useFitness()
  const [hours, setHours] = useState('7.5')
  const [stars, setStars] = useState(4)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    addSleepLog({
      date: today,
      hoursSlept: Number(hours),
      qualityStars: stars,
    })
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registro de Sono</h1>
        <p className="text-xs text-muted-foreground">
          O sono de qualidade é essencial para recuperação muscular e queima de gordura.
        </p>
      </div>

      <Card className="p-6 border-border space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs">Horas Dormidas</Label>
            <Input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="text-xs">Qualidade do Sono (1 a 5 estrelas)</Label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  className={`p-2 rounded-lg border ${stars >= s ? 'text-amber-400 bg-amber-500/10 border-amber-500' : 'text-muted-foreground'}`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-violet-600 text-white gap-2 text-xs">
            <Plus className="h-4 w-4" /> Registrar Sono
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        <h2 className="text-base font-bold">Histórico Recente</h2>
        {sleepLogs.map((s) => (
          <Card key={s.id} className="p-3 border-border flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-violet-400" />
              <span>{s.date}</span>
            </div>
            <span className="font-bold">
              {s.hoursSlept} hrs ({s.qualityStars} ★)
            </span>
          </Card>
        ))}
      </div>
    </div>
  )
}
