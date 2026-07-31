import type { Recipe } from '@/types/fitness'
import type { AIDataContext, AISessionState, AIResponse } from '@/lib/ai-types'

interface RecipeParseResult {
  recipe: Omit<Recipe, 'id'> | null
  needsText?: boolean
  message?: string
  uncertain?: string[]
}

const COOKING_KEYWORDS = [
  'assar',
  'cozinhar',
  'ferver',
  'refogar',
  'misturar',
  'bater',
  'fritar',
  'grelhar',
  'forno',
  'liquidificador',
  'colher',
  'xícara',
  'mg',
  'ml',
  'gramas',
]

export function parseRecipeText(input: string): RecipeParseResult {
  const text = input.trim()

  if (text.includes('http://') || text.includes('https://')) {
    return {
      recipe: null,
      needsText: true,
      message:
        '🔍 Não consigo acessar links externos.\n\nCole aqui o texto da receita ou a lista de ingredientes.',
    }
  }

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) {
    return {
      recipe: null,
      needsText: true,
      message:
        'Preciso de mais informações. Cole o texto completo da receita com ingredientes e modo de preparo.',
    }
  }

  let name = 'Receita AI'
  const ingredients: string[] = []
  const steps: string[] = []
  const uncertain: string[] = []
  let inIngredients = false
  let inSteps = false

  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes('ingredient')) {
      inIngredients = true
      inSteps = false
      continue
    }
    if (lower.match(/modo de preparo|preparo|instru|passos|steps/i)) {
      inSteps = true
      inIngredients = false
      continue
    }
    if (lower.match(/^receita[:\s]/i)) {
      name = line.replace(/^receita[:\s]*/i, '')
      continue
    }
    if (
      !inIngredients &&
      !inSteps &&
      line.length > 5 &&
      !line.match(/^\d/) &&
      !COOKING_KEYWORDS.some((k) => lower.includes(k))
    ) {
      name = line
      continue
    }
    if (inIngredients) {
      const cleaned = line.replace(/^[-•*\d+[.)\]]\s*/, '')
      ingredients.push(cleaned)
      if (!line.match(/\d+\s*(g|ml|colher|xícara|unidade|copo|fatia)/i)) uncertain.push(cleaned)
    } else if (inSteps) {
      steps.push(line.replace(/^[-•*\d+[.)\]]\s*/, ''))
    } else if (COOKING_KEYWORDS.some((k) => lower.includes(k))) {
      steps.push(line)
    } else if (line.match(/^\d+\s*(g|ml|colher|xícara|unidade|copo|fatia)/i)) {
      ingredients.push(line)
    }
  }

  if (ingredients.length === 0) {
    const words = text.split(/[\n,;]/).filter((w) => w.trim().length > 3)
    ingredients.push(...words.slice(0, 10).map((w) => w.trim()))
    uncertain.push(...ingredients.filter((i) => !i.match(/\d+\s*(g|ml|colher|xícara|unidade)/i)))
  }
  if (steps.length === 0) {
    steps.push('Misture os ingredientes e prepare conforme necessário.')
    uncertain.push('Modo de preparo não identificado claramente.')
  }

  const cal = Math.max(50, Math.round(ingredients.length * 45 + 80))
  return {
    recipe: {
      name,
      mealType: 'lanche',
      description: `Receita analisada pelo AI Coach${uncertain.length > 0 ? ' (alguns valores estimados)' : ''}.`,
      ingredients,
      steps,
      prepTimeMinutes: 30,
      calories: cal,
      proteinG: Math.max(2, Math.round(ingredients.length * 2.5)),
      carbsG: Math.max(5, Math.round(ingredients.length * 5)),
      fatG: Math.max(1, Math.round(ingredients.length * 2)),
      fiberG: Math.max(1, Math.round(ingredients.length * 1)),
      servings: 1,
      isCustom: true,
    },
    uncertain: uncertain.length > 0 ? uncertain : undefined,
  }
}

export function formatRecipe(result: RecipeParseResult): string {
  if (!result.recipe) return 'Não consegui analisar a receita.'
  const r = result.recipe
  const lines = [
    `🍳 **${r.name}**\n`,
    `**Ingredientes:**`,
    ...r.ingredients.map((i) => `  • ${i}`),
    `\n**Modo de Preparo:**`,
    ...r.steps.map((s, i) => `  ${i + 1}. ${s}`),
    `\n**Valores Nutricionais (por porção):**`,
    `  Calorias: ${r.calories} kcal | P:${r.proteinG}g C:${r.carbsG}g G:${r.fatG}g`,
  ]
  if (result.uncertain && result.uncertain.length > 0) {
    lines.push(`\n⚠️ **Valores estimados** — revise:`)
    lines.push(...result.uncertain.map((u) => `  • ${u}`))
    lines.push('\nConfirme ou corrija as quantidades.')
  }
  lines.push('\nDeseja salvar esta receita?')
  return lines.join('\n')
}

export function handleRecipeFlow(
  input: string,
  _ctx: AIDataContext,
  session: AISessionState,
): { response: AIResponse; newSession: AISessionState } {
  const result = parseRecipeText(input)
  if (result.recipe) {
    return {
      response: {
        text: formatRecipe(result),
        action: { type: 'save_recipe', recipe: result.recipe },
        quickActions: ['Salvar receita'],
      },
      newSession: { ...session, pendingFlow: null },
    }
  }
  return {
    response: {
      text: result.message || 'Não consegui analisar. Cole o texto completo da receita.',
    },
    newSession: { ...session, pendingFlow: 'recipe' },
  }
}
