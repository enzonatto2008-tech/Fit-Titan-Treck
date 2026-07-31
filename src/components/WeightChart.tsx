import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { WeightEntry } from '@/types/fitness'

const chartConfig = {
  weight: { label: 'Peso (kg)', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const data = entries.map((e) => ({
    date: e.date.slice(5),
    weight: e.weightKg,
  }))

  if (data.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-8">Sem dados de peso ainda.</p>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="weight"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ r: 3, fill: 'hsl(var(--chart-1))' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
