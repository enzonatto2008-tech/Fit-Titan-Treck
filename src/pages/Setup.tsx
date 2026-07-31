import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFitness } from '@/hooks/use-fitness'
import { Gender, ActivityLevel, FitnessGoal } from '@/types/fitness'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CheckCircle, Sparkles } from 'lucide-react'

export default function Setup() {
  const { user, updateUserProfile } = useFitness()
  const navigate = useNavigate()

  const [age, setAge] = useState(user.age || 25)
  const [gender, setGender] = useState<Gender>(user.gender || 'male')
  const [heightCm, setHeightCm] = useState(user.heightCm || 175)
  const [weightKg, setWeightKg] = useState(user.weightKg || 75)
  const [goalWeightKg, setGoalWeightKg] = useState(user.goalWeightKg || 70)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user.activityLevel || 'moderate',
  )
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user.fitnessGoal || 'weight_loss')

  // Mifflin-St Jeor Calculation
  const calculateTMB = () => {
    if (gender === 'male') {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
    }
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161)
  }

  const getActivityFactor = () => {
    switch (activityLevel) {
      case 'sedentary':
        return 1.2
      case 'light':
        return 1.375
      case 'moderate':
        return 1.55
      case 'active':
        return 1.725
      case 'very_active':
        return 1.9
    }
  }

  const tmb = calculateTMB()
  const tdee = Math.round(tmb * getActivityFactor())

  let targetCalories = tdee
  if (fitnessGoal === 'weight_loss') targetCalories = Math.round(tdee - 500)
  if (fitnessGoal === 'muscle_gain') targetCalories = Math.round(tdee + 300)

  const proteinG = Math.round(weightKg * 2.0)
  const fatG = Math.round(weightKg * 0.8)
  const carbsG = Math.round(Math.max(50, (targetCalories - (proteinG * 4 + fatG * 9)) / 4))

  const handleFinish = () => {
    updateUserProfile({
      age,
      gender,
      heightCm,
      weightKg,
      goalWeightKg,
      activityLevel,
      fitnessGoal,
      tmb,
      dailyCaloriesTarget: targetCalories,
      proteinTargetG: proteinG,
      carbsTargetG: carbsG,
      fatTargetG: fatG,
      waterTargetMl: Math.round(weightKg * 35),
      isSetupCompleted: true,
    })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Configuração do seu Perfil Metabólico</h1>
        <p className="text-xs text-muted-foreground">
          A inteligência artificial do FitTrack irá calcular suas necessidades nutricionais exatas.
        </p>
      </div>

      <Card className="p-6 space-y-4 border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Idade</Label>
            <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>
          <div>
            <Label className="text-xs">Sexo biológico</Label>
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
            <Label className="text-xs">Peso Atual (kg)</Label>
            <Input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Peso Objetivo (kg)</Label>
            <Input
              type="number"
              value={goalWeightKg}
              onChange={(e) => setGoalWeightKg(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-xs">Objetivo Principal</Label>
            <Select value={fitnessGoal} onValueChange={(v: FitnessGoal) => setFitnessGoal(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Emagrecimento / Perda de Gordura</SelectItem>
                <SelectItem value="maintenance">Manutenção de Peso</SelectItem>
                <SelectItem value="muscle_gain">Ganho de Massa Muscular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs">Nível de Atividade Física</Label>
          <Select value={activityLevel} onValueChange={(v: ActivityLevel) => setActivityLevel(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="light">Leve (exercício 1-3 dias/semana)</SelectItem>
              <SelectItem value="moderate">Moderado (exercício 3-5 dias/semana)</SelectItem>
              <SelectItem value="active">Ativo (exercício 6-7 dias/semana)</SelectItem>
              <SelectItem value="very_active">Muito Ativo (treinos intensos diários)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calculated Preview */}
        <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
            <Sparkles className="h-4 w-4" /> Recomendações Calculadas
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-card rounded-lg border">
              <span className="text-muted-foreground block text-[10px]">TMB</span>
              <strong className="text-sm font-bold">{tmb} kcal</strong>
            </div>
            <div className="p-2 bg-card rounded-lg border">
              <span className="text-muted-foreground block text-[10px]">Calorias Diárias</span>
              <strong className="text-sm font-bold text-emerald-500">{targetCalories} kcal</strong>
            </div>
            <div className="p-2 bg-card rounded-lg border">
              <span className="text-muted-foreground block text-[10px]">Proteínas</span>
              <strong className="text-sm font-bold">{proteinG}g</strong>
            </div>
            <div className="p-2 bg-card rounded-lg border">
              <span className="text-muted-foreground block text-[10px]">
                Carboidratos / Gordura
              </span>
              <strong className="text-sm font-bold">
                {carbsG}g / {fatG}g
              </strong>
            </div>
          </div>
        </div>

        <Button
          onClick={handleFinish}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 mt-4"
        >
          <CheckCircle className="h-4 w-4" /> Concluir e Ir para o Dashboard
        </Button>
      </Card>
    </div>
  )
}
