import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { downloadCSV, downloadJSON } from '@/lib/export-utils'
import { Download, FileText, FileJson, Printer } from 'lucide-react'

export default function ExportCenter() {
  const { user, weightEntries, mealLogs, sessions, waterLogs, sleepLogs, routines } = useFitness()

  const exportWeightCSV = () => {
    downloadCSV(
      'historico-peso.csv',
      ['Data', 'Peso (kg)', 'Gordura %', 'Massa Magra (kg)', 'Notas'],
      weightEntries.map((e) => [
        e.date,
        e.weightKg,
        e.bodyFatPercentage || '',
        e.leanMassKg || '',
        e.notes || '',
      ]),
    )
  }

  const exportMealsCSV = () => {
    downloadCSV(
      'refeicoes.csv',
      ['Data', 'Refeição', 'Alimento', 'Gramas', 'Calorias', 'Proteína', 'Carbo', 'Gordura'],
      mealLogs.map((m) => [
        m.date,
        m.mealCategory,
        m.foodName,
        m.totalGrams,
        m.calories,
        m.proteinG,
        m.carbsG,
        m.fatG,
      ]),
    )
  }

  const exportWorkoutsCSV = () => {
    downloadCSV(
      'treinos.csv',
      ['Data', 'Rotina', 'Duração (min)', 'Exercícios'],
      sessions.map((s) => [
        s.date,
        s.routineName,
        s.durationMinutes,
        s.exercises.map((e) => e.exerciseName).join(' | '),
      ]),
    )
  }

  const exportWaterCSV = () => {
    downloadCSV(
      'hidratacao.csv',
      ['Data', 'Horário', 'Volume (ml)'],
      waterLogs.map((w) => [w.date, w.timestamp, w.amountMl]),
    )
  }

  const exportSleepCSV = () => {
    downloadCSV(
      'sono.csv',
      ['Data', 'Horas', 'Qualidade (1-5)', 'Notas'],
      sleepLogs.map((s) => [s.date, s.hoursSlept, s.qualityStars, s.notes || '']),
    )
  }

  const exportAllJSON = () => {
    downloadJSON('fittrack-backup.json', {
      user,
      weightEntries,
      mealLogs,
      sessions,
      waterLogs,
      sleepLogs,
      routines,
      exportedAt: new Date().toISOString(),
    })
  }

  const exports = [
    {
      label: 'Histórico de Peso',
      desc: 'CSV com datas, peso e composição',
      action: exportWeightCSV,
      icon: FileText,
    },
    {
      label: 'Refeições Registradas',
      desc: 'CSV com todos os alimentos e macros',
      action: exportMealsCSV,
      icon: FileText,
    },
    {
      label: 'Treinos Realizados',
      desc: 'CSV com sessões e exercícios',
      action: exportWorkoutsCSV,
      icon: FileText,
    },
    {
      label: 'Hidratação',
      desc: 'CSV com registros de água',
      action: exportWaterCSV,
      icon: FileText,
    },
    {
      label: 'Registro de Sono',
      desc: 'CSV com qualidade e horas',
      action: exportSleepCSV,
      icon: FileText,
    },
    {
      label: 'Backup Completo',
      desc: 'JSON com todos os dados',
      action: exportAllJSON,
      icon: FileJson,
    },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Central de Exportação</h1>
        <p className="text-xs text-muted-foreground">
          Baixe seus dados em CSV, Excel ou JSON. Seus dados, seu controle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exports.map((exp) => (
          <Card
            key={exp.label}
            className="p-5 border-border space-y-3 hover:border-violet-500/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-500 shrink-0">
                <exp.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">{exp.label}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{exp.desc}</p>
              </div>
            </div>
            <Button
              onClick={exp.action}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2"
            >
              <Download className="h-3.5 w-3.5" /> Baixar {exp.label}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-5 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
            <Printer className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Imprimir Relatório</h3>
            <p className="text-[11px] text-muted-foreground">
              Gere um PDF usando o diálogo de impressão do navegador
            </p>
          </div>
          <Button variant="outline" onClick={() => window.print()} className="text-xs gap-2">
            <Printer className="h-3.5 w-3.5" /> Imprimir
          </Button>
        </div>
      </Card>

      <p className="text-[11px] text-center text-muted-foreground">
        💡 Arquivos CSV podem ser abertos no Excel, Google Sheets e Apple Numbers.
      </p>
    </div>
  )
}
