import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { downloadCSV, downloadJSON, downloadExcel, downloadPDF } from '@/lib/export-utils'
import { Download, FileText, FileJson, Printer, FileSpreadsheet, FileType } from 'lucide-react'

export default function ExportCenter() {
  const { user, weightEntries, mealLogs, sessions, waterLogs, sleepLogs, routines } = useFitness()

  const weightHeaders = ['Data', 'Peso (kg)', 'Gordura %', 'Massa Magra (kg)', 'Notas']
  const weightRows = weightEntries.map((e) => [
    e.date,
    e.weightKg,
    e.bodyFatPercentage || '',
    e.leanMassKg || '',
    e.notes || '',
  ])

  const mealHeaders = [
    'Data',
    'Refeição',
    'Alimento',
    'Gramas',
    'Calorias',
    'Proteína',
    'Carbo',
    'Gordura',
  ]
  const mealRows = mealLogs.map((m) => [
    m.date,
    m.mealCategory,
    m.foodName,
    m.totalGrams,
    m.calories,
    m.proteinG,
    m.carbsG,
    m.fatG,
  ])

  const workoutHeaders = ['Data', 'Rotina', 'Duração (min)', 'Exercícios']
  const workoutRows = sessions.map((s) => [
    s.date,
    s.routineName,
    s.durationMinutes,
    s.exercises.map((e) => e.exerciseName).join(' | '),
  ])

  const waterHeaders = ['Data', 'Horário', 'Volume (ml)']
  const waterRows = waterLogs.map((w) => [w.date, w.timestamp, w.amountMl])

  const sleepHeaders = ['Data', 'Horas', 'Qualidade (1-5)', 'Notas']
  const sleepRows = sleepLogs.map((s) => [s.date, s.hoursSlept, s.qualityStars, s.notes || ''])

  const exports = [
    {
      label: 'Histórico de Peso',
      desc: 'CSV/Excel com datas, peso e composição',
      headers: weightHeaders,
      rows: weightRows,
      icon: FileText,
    },
    {
      label: 'Refeições',
      desc: 'CSV/Excel com alimentos e macros',
      headers: mealHeaders,
      rows: mealRows,
      icon: FileText,
    },
    {
      label: 'Treinos',
      desc: 'CSV/Excel com sessões e exercícios',
      headers: workoutHeaders,
      rows: workoutRows,
      icon: FileText,
    },
    {
      label: 'Hidratação',
      desc: 'CSV/Excel com registros de água',
      headers: waterHeaders,
      rows: waterRows,
      icon: FileText,
    },
    {
      label: 'Sono',
      desc: 'CSV/Excel com qualidade e horas',
      headers: sleepHeaders,
      rows: sleepRows,
      icon: FileText,
    },
  ]

  const exportFullPDF = () => {
    downloadPDF('Relatório FitTitanTrack', [
      {
        heading: 'Perfil do Usuário',
        headers: ['Campo', 'Valor'],
        rows: [
          ['Nome', user.name],
          ['Email', user.email],
          ['Peso', `${user.weightKg} kg`],
          ['Meta', `${user.goalWeightKg} kg`],
          ['Calorias/dia', `${user.dailyCaloriesTarget} kcal`],
        ],
      },
      { heading: 'Histórico de Peso', headers: weightHeaders, rows: weightRows },
      { heading: 'Refeições', headers: mealHeaders, rows: mealRows },
      { heading: 'Treinos', headers: workoutHeaders, rows: workoutRows },
      { heading: 'Hidratação', headers: waterHeaders, rows: waterRows },
      { heading: 'Sono', headers: sleepHeaders, rows: sleepRows },
    ])
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Central de Exportação</h1>
        <p className="text-xs text-muted-foreground">
          Baixe seus dados reais em CSV, Excel e PDF. Seus dados, seu controle.
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
            <div className="flex gap-2">
              <Button
                onClick={() => downloadCSV(`${exp.label}.csv`, exp.headers, exp.rows)}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1"
              >
                <Download className="h-3 w-3" /> CSV
              </Button>
              <Button
                onClick={() => downloadExcel(`${exp.label}.xls`, exp.headers, exp.rows)}
                variant="outline"
                className="flex-1 text-xs gap-1"
              >
                <FileSpreadsheet className="h-3 w-3" /> Excel
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 border-border space-y-3 hover:border-violet-500/40 transition-all">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
            <FileType className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Relatório PDF Completo</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Documento PDF com todos os dados: peso, refeições, treinos, hidratação e sono
            </p>
          </div>
        </div>
        <Button
          onClick={exportFullPDF}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2"
        >
          <FileType className="h-3.5 w-3.5" /> Gerar Relatório PDF
        </Button>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 border-border space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-500 shrink-0">
              <FileJson className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold">Backup Completo (JSON)</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Todos os dados em formato JSON
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
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
            className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2"
          >
            <Download className="h-3.5 w-3.5" /> Baixar Backup
          </Button>
        </Card>

        <Card className="p-5 border-border space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
              <Printer className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold">Imprimir Relatório</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PDF via diálogo de impressão
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.print()} className="w-full text-xs gap-2">
            <Printer className="h-3.5 w-3.5" /> Imprimir
          </Button>
        </Card>
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        💡 Arquivos CSV/Excel abrem no Excel, Google Sheets e Apple Numbers. PDF pode ser salvo na
        impressão.
      </p>
    </div>
  )
}
