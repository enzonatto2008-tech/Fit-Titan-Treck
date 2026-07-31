import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { FileText, TrendingDown, Flame, Droplet } from 'lucide-react'

export default function Reports() {
  const { user, weightEntries, mealLogs, waterLogs } = useFitness()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios de Desempenho</h1>
        <p className="text-xs text-muted-foreground">
          Análise detalhada do seu progresso consolidado em dados e métricas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-border space-y-2">
          <div className="flex justify-between items-center text-emerald-500">
            <span className="text-xs font-semibold uppercase">Evolução do Peso</span>
            <TrendingDown className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{user.weightKg} kg</p>
          <p className="text-[11px] text-muted-foreground">
            Meta: {user.goalWeightKg} kg ({weightEntries.length} registros)
          </p>
        </Card>

        <Card className="p-5 border-border space-y-2">
          <div className="flex justify-between items-center text-amber-500">
            <span className="text-xs font-semibold uppercase">Consumo de Alimentação</span>
            <Flame className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{user.dailyCaloriesTarget} kcal/dia</p>
          <p className="text-[11px] text-muted-foreground">{mealLogs.length} refeições gravadas</p>
        </Card>

        <Card className="p-5 border-border space-y-2">
          <div className="flex justify-between items-center text-blue-500">
            <span className="text-xs font-semibold uppercase">Média de Hidratação</span>
            <Droplet className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{user.waterTargetMl} ml/dia</p>
          <p className="text-[11px] text-muted-foreground">
            {waterLogs.length} registros efetuados
          </p>
        </Card>
      </div>

      <Card className="p-6 border-border space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-500" /> Resumo do Plano Metabólico
        </h2>
        <div className="text-xs space-y-2 text-muted-foreground">
          <p>
            • <strong>IMC Estimado:</strong>{' '}
            {(user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1)} (Faixa Normal/Saudável)
          </p>
          <p>
            • <strong>Taxa Metabólica Basal (TMB):</strong> {user.tmb} kcal
          </p>
          <p>
            • <strong>Distribuição Macronutricional:</strong> Proteínas ({user.proteinTargetG}g),
            Carboidratos ({user.carbsTargetG}g), Gorduras ({user.fatTargetG}g)
          </p>
        </div>
      </Card>
    </div>
  )
}
