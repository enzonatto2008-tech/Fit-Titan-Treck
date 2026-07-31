import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function Goals() {
  const { user, updateUserProfile } = useFitness()

  const [weight, setWeight] = useState(user.goalWeightKg)
  const [cal, setCal] = useState(user.dailyCaloriesTarget)
  const [prot, setProt] = useState(user.proteinTargetG)
  const [carbs, setCarbs] = useState(user.carbsTargetG)
  const [fat, setFat] = useState(user.fatTargetG)
  const [water, setWater] = useState(user.waterTargetMl)

  const handleSave = () => {
    updateUserProfile({
      goalWeightKg: Number(weight),
      dailyCaloriesTarget: Number(cal),
      proteinTargetG: Number(prot),
      carbsTargetG: Number(carbs),
      fatTargetG: Number(fat),
      waterTargetMl: Number(water),
    })
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Metas</h1>
        <p className="text-xs text-muted-foreground">
          Ajuste manualmente suas metas diárias conforme orientação profissional.
        </p>
      </div>

      <Card className="p-6 border-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Peso Alvo (kg)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Calorias Diárias (kcal)</Label>
            <Input type="number" value={cal} onChange={(e) => setCal(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Proteínas (g)</Label>
            <Input type="number" value={prot} onChange={(e) => setProt(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Carboidratos (g)</Label>
            <Input type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Gorduras (g)</Label>
            <Input type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Água Diária (ml)</Label>
            <Input type="number" value={water} onChange={(e) => setWater(Number(e.target.value))} />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-emerald-600 text-white gap-2 text-xs">
          <Check className="h-4 w-4" /> Salvar Novas Metas
        </Button>
      </Card>
    </div>
  )
}
