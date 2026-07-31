import { useFitness } from '@/hooks/use-fitness'
import { MealCategory } from '@/types/fitness'
import { AddFoodModal } from '@/components/AddFoodModal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Trash2, Flame } from 'lucide-react'

const CATEGORIES: { key: MealCategory; label: string }[] = [
  { key: 'cafédamanhã', label: 'Café da Manhã' },
  { key: 'almoço', label: 'Almoço' },
  { key: 'lanche', label: 'Lanche da Tarde' },
  { key: 'prétreino', label: 'Pré-Treino' },
  { key: 'póstreino', label: 'Pós-Treino' },
  { key: 'jantar', label: 'Jantar' },
  { key: 'ceia', label: 'Ceia' },
]

export default function Meals() {
  const { mealLogs, removeMealItem } = useFitness()
  const todayStr = new Date().toISOString().split('T')[0]

  const todayLogs = mealLogs.filter((m) => m.date === todayStr)
  const totalCalories = todayLogs.reduce((a, b) => a + b.calories, 0)
  const totalProt = todayLogs.reduce((a, b) => a + b.proteinG, 0)
  const totalCarb = todayLogs.reduce((a, b) => a + b.carbsG, 0)
  const totalFat = todayLogs.reduce((a, b) => a + b.fatG, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Refeições</h1>
          <p className="text-xs text-muted-foreground">
            Acompanhe com precisão cada alimento ingerido no dia.
          </p>
        </div>

        {/* Daily Summary Bar */}
        <div className="flex gap-4 p-3 rounded-xl bg-card border border-border text-xs">
          <div className="flex items-center gap-1.5 font-bold text-violet-500">
            <Flame className="h-4 w-4" /> {totalCalories} kcal
          </div>
          <div className="text-muted-foreground">
            P: <strong className="text-foreground">{totalProt.toFixed(0)}g</strong>
          </div>
          <div className="text-muted-foreground">
            C: <strong className="text-foreground">{totalCarb.toFixed(0)}g</strong>
          </div>
          <div className="text-muted-foreground">
            G: <strong className="text-foreground">{totalFat.toFixed(0)}g</strong>
          </div>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['cafédamanhã', 'almoço', 'jantar']}
        className="space-y-3"
      >
        {CATEGORIES.map((cat) => {
          const categoryMeals = todayLogs.filter((m) => m.mealCategory === cat.key)
          const catCalories = categoryMeals.reduce((a, b) => a + b.calories, 0)

          return (
            <AccordionItem
              key={cat.key}
              value={cat.key}
              className="border border-border rounded-xl bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4 text-sm font-semibold">
                  <span>{cat.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {catCalories} kcal ({categoryMeals.length} itens)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-3">
                {categoryMeals.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum alimento nesta refeição.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categoryMeals.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-accent/30 text-xs"
                      >
                        <div>
                          <p className="font-semibold">{item.foodName}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.totalGrams}g • P: {item.proteinG}g | C: {item.carbsG}g | G:{' '}
                            {item.fatG}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-violet-500">{item.calories} kcal</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeMealItem(item.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <AddFoodModal category={cat.key} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
