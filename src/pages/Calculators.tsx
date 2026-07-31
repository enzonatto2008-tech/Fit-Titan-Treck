import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateBodyFat,
  getBodyFatCategory,
  calculateMacroTargets,
} from '@/lib/fitness-calculators'
import { ActivityLevel, FitnessGoal, Gender } from '@/types/fitness'
import { Calculator, Heart, Scale, Flame } from 'lucide-react'

export default function Calculators() {
  const { user } = useFitness()

  const [age, setAge] = useState(user.age)
  const [gender, setGender] = useState<Gender>(user.gender)
  const [heightCm, setHeightCm] = useState(user.heightCm)
  const [weightKg, setWeightKg] = useState(user.weightKg)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel)
  const [goal, setGoal] = useState<FitnessGoal>(user.fitnessGoal)
  const [waistCm, setWaistCm] = useState(85)
  const [neckCm, setNeckCm] = useState(38)
  const [hipCm, setHipCm] = useState(95)

  const bmi = calculateBMI(weightKg, heightCm)
  const bmiCat = getBMICategory(bmi)
  const bmr = calculateBMR(gender, weightKg, heightCm, age)
  const tdee = calculateTDEE(bmr, activityLevel)
  const bodyFat = calculateBodyFat(gender, waistCm, neckCm, heightCm, hipCm)
  const bfCat = getBodyFatCategory(bodyFat, gender)
  const macros = calculateMacroTargets(tdee, goal, weightKg)

  const results = [
    { icon: Scale, label: 'IMC', value: bmi, unit: '', category: bmiCat, color: 'text-violet-500' },
    {
      icon: Heart,
      label: 'BF (Gordura)',
      value: bodyFat,
      unit: '%',
      category: bfCat,
      color: 'text-fuchsia-500',
    },
    {
      icon: Calculator,
      label: 'TMB',
      value: bmr,
      unit: 'kcal',
      category: 'Metabolismo Basal',
      color: 'text-purple-500',
    },
    {
      icon: Flame,
      label: 'TDEE',
      value: tdee,
      unit: 'kcal',
      category: 'Gasto Calórico Diário',
      color: 'text-pink-500',
    },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calculadoras Fitness</h1>
        <p className="text-xs text-muted-foreground">
          IMC, TMB, TDEE e percentual de gordura corporal com precisão.
        </p>
      </div>

      <Card className="p-6 border-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Idade</Label>
            <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Sexo</Label>
            <Select value={gender} onValueChange={(v: Gender) => setGender(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Altura (cm)</Label>
            <Input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Peso (kg)</Label>
            <Input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Cintura (cm)</Label>
            <Input
              type="number"
              value={waistCm}
              onChange={(e) => setWaistCm(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Pescoço (cm)</Label>
            <Input
              type="number"
              value={neckCm}
              onChange={(e) => setNeckCm(Number(e.target.value))}
            />
          </div>
          {gender === 'female' && (
            <div>
              <Label className="text-xs">Quadril (cm)</Label>
              <Input
                type="number"
                value={hipCm}
                onChange={(e) => setHipCm(Number(e.target.value))}
              />
            </div>
          )}
          <div>
            <Label className="text-xs">Nível de Atividade</Label>
            <Select value={activityLevel} onValueChange={(v: ActivityLevel) => setActivityLevel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentário</SelectItem>
                <SelectItem value="light">Leve</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="very_active">Muito Ativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Objetivo</Label>
            <Select value={goal} onValueChange={(v: FitnessGoal) => setGoal(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Emagrecimento</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="muscle_gain">Hipertrofia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((r) => (
          <Card key={r.label} className="p-4 border-border space-y-2 text-center">
            <div className={`p-2 rounded-lg bg-accent/50 w-fit mx-auto ${r.color}`}>
              <r.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">
              {r.value}
              {r.unit}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">{r.label}</p>
            <p className="text-[10px] text-violet-500 font-semibold">{r.category}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-border space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Calculator className="h-4 w-4 text-violet-500" /> Recomendação de Macronutrientes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <p className="text-[10px] text-muted-foreground">Calorias Diárias</p>
            <p className="text-xl font-bold text-violet-500">{macros.calories}</p>
            <p className="text-[9px] text-muted-foreground">kcal</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/50 border">
            <p className="text-[10px] text-muted-foreground">Proteínas</p>
            <p className="text-xl font-bold">{macros.proteinG}g</p>
            <p className="text-[9px] text-muted-foreground">{macros.proteinG * 4} kcal</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/50 border">
            <p className="text-[10px] text-muted-foreground">Carboidratos</p>
            <p className="text-xl font-bold">{macros.carbsG}g</p>
            <p className="text-[9px] text-muted-foreground">{macros.carbsG * 4} kcal</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/50 border">
            <p className="text-[10px] text-muted-foreground">Gorduras</p>
            <p className="text-xl font-bold">{macros.fatG}g</p>
            <p className="text-[9px] text-muted-foreground">{macros.fatG * 9} kcal</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
