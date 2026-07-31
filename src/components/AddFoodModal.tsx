import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { FoodItem, MealCategory } from '@/types/fitness'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'

interface AddFoodModalProps {
  category: MealCategory
  trigger?: React.ReactNode
}

export function AddFoodModal({ category, trigger }: AddFoodModalProps) {
  const { foods, addMealItem, addCustomFood } = useFitness()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState<number>(100)
  const [showCustomForm, setShowCustomForm] = useState(false)

  const [customName, setCustomName] = useState('')
  const [customCal, setCustomCal] = useState('')
  const [customProt, setCustomProt] = useState('')
  const [customCarb, setCustomCarb] = useState('')
  const [customFat, setCustomFat] = useState('')

  const filteredFoods = foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food)
    setQuantity(food.servingSizeG)
  }

  const handleAddMeal = () => {
    if (!selectedFood) return
    const ratio = quantity / selectedFood.servingSizeG
    const todayStr = new Date().toISOString().split('T')[0]

    addMealItem({
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      mealCategory: category,
      servings: ratio,
      servingUnit: selectedFood.servingUnit,
      totalGrams: quantity,
      calories: Math.round(selectedFood.calories * ratio),
      proteinG: Number((selectedFood.proteinG * ratio).toFixed(1)),
      carbsG: Number((selectedFood.carbsG * ratio).toFixed(1)),
      fatG: Number((selectedFood.fatG * ratio).toFixed(1)),
      date: todayStr,
    })

    setOpen(false)
    setSelectedFood(null)
  }

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName || !customCal) return

    addCustomFood({
      name: customName,
      servingSizeG: 100,
      servingUnit: 'g',
      calories: Number(customCal),
      proteinG: Number(customProt) || 0,
      carbsG: Number(customCarb) || 0,
      fatG: Number(customFat) || 0,
    })

    setShowCustomForm(false)
    setCustomName('')
    setCustomCal('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Adicionar Alimento em <span className="capitalize text-emerald-500">{category}</span>
          </DialogTitle>
        </DialogHeader>

        {!showCustomForm ? (
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar arroz, frango, ovo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 border border-border rounded-lg p-2 max-h-48">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className={`p-2.5 rounded-md cursor-pointer transition text-xs flex justify-between items-center ${
                    selectedFood?.id === food.id
                      ? 'bg-emerald-500/20 border border-emerald-500'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">{food.name}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {food.calories} kcal | P: {food.proteinG}g C: {food.carbsG}g G: {food.fatG}g (
                      {food.servingSizeG}
                      {food.servingUnit})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedFood && (
              <div className="p-3 bg-accent/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold">{selectedFood.name}</span>
                  <span className="text-emerald-500 font-bold">
                    {Math.round((selectedFood.calories * quantity) / selectedFood.servingSizeG)}{' '}
                    kcal
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs shrink-0">Quantidade (g/ml):</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
                <Button
                  onClick={handleAddMeal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white size-sm"
                >
                  Confirmar Adição
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomForm(true)}
              className="text-xs text-muted-foreground"
            >
              + Cadastrar Alimento Customizado
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateCustom} className="space-y-3">
            <div>
              <Label className="text-xs">Nome do Alimento</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Calorias (100g)</Label>
                <Input
                  type="number"
                  value={customCal}
                  onChange={(e) => setCustomCal(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Proteína (g)</Label>
                <Input
                  type="number"
                  value={customProt}
                  onChange={(e) => setCustomProt(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Carboidratos (g)</Label>
                <Input
                  type="number"
                  value={customCarb}
                  onChange={(e) => setCustomCarb(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Gorduras (g)</Label>
                <Input
                  type="number"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCustomForm(false)}
                className="w-1/2"
              >
                Voltar
              </Button>
              <Button type="submit" size="sm" className="w-1/2 bg-emerald-600 text-white">
                Salvar e Usar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
