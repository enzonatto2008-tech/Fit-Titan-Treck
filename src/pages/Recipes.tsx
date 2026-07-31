import { useState, useMemo } from 'react'
import { useRecipes } from '@/hooks/use-recipes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, Heart, Clock, Flame, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

const MEAL_FILTERS = [
  'todos',
  'cafédamanhã',
  'lanche',
  'almoço',
  'prétreino',
  'póstreino',
  'jantar',
  'ceia',
]

const MEAL_LABELS: Record<string, string> = {
  cafédamanhã: 'Café da Manhã',
  lanche: 'Lanche',
  almoço: 'Almoço',
  prétreino: 'Pré-Treino',
  póstreino: 'Pós-Treino',
  jantar: 'Jantar',
  ceia: 'Ceia',
}

export default function Recipes() {
  const { recipes, toggleFavorite, isFavorite } = useRecipes()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'todos' || r.mealType === filter
      return matchesSearch && matchesFilter
    })
  }, [recipes, search, filter])

  const selectedRecipe = recipes.find((r) => r.id === selectedId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Receitas</h1>
        <p className="text-xs text-muted-foreground">
          Centenas de receitas fit organizadas por refeição. Favorite suas preferidas!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar receitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {MEAL_FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className={cn('text-xs capitalize', filter === f && 'bg-violet-600 text-white')}
          >
            {f === 'todos' ? 'Todas' : MEAL_LABELS[f] || f}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((recipe) => (
          <Dialog key={recipe.id} onOpenChange={(open) => setSelectedId(open ? recipe.id : null)}>
            <Card className="p-4 border-border space-y-3 hover:border-violet-500/40 transition-all cursor-pointer">
              <DialogTrigger asChild>
                <div className="space-y-3" onClick={() => setSelectedId(recipe.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="secondary" className="text-[10px] mb-1">
                        {MEAL_LABELS[recipe.mealType] || recipe.mealType}
                      </Badge>
                      <h3 className="text-sm font-bold leading-tight">{recipe.name}</h3>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(recipe.id)
                      }}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isFavorite(recipe.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-muted-foreground',
                        )}
                      />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {recipe.prepTimeMinutes}min
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-violet-500">
                      <Flame className="h-3 w-3" /> {recipe.calories} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <ChefHat className="h-3 w-3" /> P:{recipe.proteinG}g
                    </span>
                  </div>
                </div>
              </DialogTrigger>
            </Card>
          </Dialog>
        ))}
      </div>

      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">{selectedRecipe.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <Badge variant="secondary">{MEAL_LABELS[selectedRecipe.mealType]}</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {selectedRecipe.prepTimeMinutes} min
                  </span>
                  <span className="flex items-center gap-1 font-bold text-violet-500">
                    <Flame className="h-3 w-3" /> {selectedRecipe.calories} kcal
                  </span>
                  <span className="text-muted-foreground">Porções: {selectedRecipe.servings}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-accent/50">
                    <p className="text-[10px] text-muted-foreground">Proteína</p>
                    <p className="text-sm font-bold">{selectedRecipe.proteinG}g</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50">
                    <p className="text-[10px] text-muted-foreground">Carbo</p>
                    <p className="text-sm font-bold">{selectedRecipe.carbsG}g</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50">
                    <p className="text-[10px] text-muted-foreground">Gordura</p>
                    <p className="text-sm font-bold">{selectedRecipe.fatG}g</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-2">Ingredientes</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-violet-500 mt-0.5">•</span> {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-2">Modo de Preparo</h4>
                  <ol className="space-y-2 text-xs text-muted-foreground">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-violet-500 text-white text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
