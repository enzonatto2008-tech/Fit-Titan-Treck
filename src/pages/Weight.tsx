import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

export default function Weight() {
  const { weightEntries, addWeightEntry, removeWeightEntry } = useFitness()
  const [weightKg, setWeightKg] = useState<string>('')
  const [fatPct, setFatPct] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!weightKg) return
    const today = new Date().toISOString().split('T')[0]

    addWeightEntry({
      date: today,
      weightKg: Number(weightKg),
      bodyFatPercentage: fatPct ? Number(fatPct) : undefined,
      notes,
    })

    setWeightKg('')
    setFatPct('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Diário de Peso & Composição</h1>
        <p className="text-xs text-muted-foreground">
          Registre seu peso regularmente para monitorar a tendência de evolução corporal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-4 border-border h-fit">
          <h2 className="text-base font-bold">Novo Registro de Peso</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="text-xs">Peso (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                placeholder="Ex: 78.5"
              />
            </div>
            <div>
              <Label className="text-xs">Gordura Corporal (%) - Opcional</Label>
              <Input
                type="number"
                step="0.1"
                value={fatPct}
                onChange={(e) => setFatPct(e.target.value)}
                placeholder="Ex: 18.5"
              />
            </div>
            <div>
              <Label className="text-xs">Observações</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Em jejum, pós treino..."
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
            >
              <Plus className="h-4 w-4" /> Registrar Peso
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2 p-5 border-border space-y-4">
          <h2 className="text-base font-bold">Histórico Recente</h2>
          <div className="space-y-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Peso</th>
                  <th className="pb-2">Gordura %</th>
                  <th className="pb-2">Notas</th>
                  <th className="pb-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {weightEntries
                  .slice()
                  .reverse()
                  .map((e) => (
                    <tr key={e.id}>
                      <td className="py-2.5 font-medium">{e.date}</td>
                      <td className="py-2.5 font-bold text-emerald-500">{e.weightKg} kg</td>
                      <td className="py-2.5">
                        {e.bodyFatPercentage ? `${e.bodyFatPercentage}%` : '-'}
                      </td>
                      <td className="py-2.5 text-muted-foreground text-[11px]">{e.notes || '-'}</td>
                      <td className="py-2.5 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeWeightEntry(e.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
