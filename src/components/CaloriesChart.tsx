import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { MealItemLog } from '@/types/fitness'

const chartConfig = {
  calories: { label: 'Calorias', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

export function CaloriesChart({ mealLogs }: { mealLogs: MealItemLog[] }) {
  const days: { date: string; calories: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const cal = mealLogs.filter((m) => m.date === dateStr).reduce((a, b) => a + b.calories, 0)
    days.push({ date: dateStr.slice(5), calories: cal })
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={days} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="calories" fill="hsl(var(--chart-1))" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
