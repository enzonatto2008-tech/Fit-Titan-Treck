import type { FoodItem, FitnessGoal, Gender } from '@/types/fitness'
import type { AIDataContext, AISessionState, AIResponse } from '@/lib/ai-types'
import { calculateBMR, calculateTDEE, calculateMacroTargets } from '@/lib/fitness-calculators'

interface DietQuestion {
  key: string
  question: string
}

export const DIET_QUESTIONS: DietQuestion[] = [
  { key: 'age', question: 'Qual é a sua idade?' },
  { key: 'height', question: 'Qual é a sua altura (em cm)?' },
  { key: 'weight', question: 'Qual é o seu peso atual (em kg)?' },
  { key: 'goal', question: 'Qual é o seu objetivo? (emagrecer, manter, ganhar massa)' },
  {
    key: 'routine',
    question: 'Como é sua rotina diária? (sedentário, leve, moderado, ativo, muito ativo)',
  },
  { key: 'allergies', question: 'Tem alguma alergia ou restrição alimentar? (ou "nenhuma")' },
  { key: 'likedFoods', question: 'Quais alimentos você mais gosta?' },
  { key: 'dislikedFoods', question: 'Quais alimentos você não gosta?' },
  { key: 'budget', question: 'Qual é seu orçamento mensal para alimentação? (baixo, médio, alto)' },
]

interface DietMeal {
  category: string
  foods: {
    name: string
    grams: number
    calories: number
    proteinG: number
    carbsG: number
    fatG: number
  }[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface DietPlan {
  targetCalories: number
  proteinG: number
  carbsG: number
  fatG: number
  meals: DietMeal[]
}

const ACTIVITY_MAP: Record<string, 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'> =
  {
    sedentario: 'sedentary',
    sedentário: 'sedentary',
    leve: 'light',
    moderado: 'moderate',
    ativo: 'active',
    'muito ativo': 'very_active',
    muitoativo: 'very_active',
  }

const GOAL_MAP: Record<string, FitnessGoal> = {
  emagrecer: 'weight_loss',
  perder: 'weight_loss',
  emagrecimento: 'weight_loss',
  manter: 'maintenance',
  manutenção: 'maintenance',
  manutencao: 'maintenance',
  ganhar: 'muscle_gain',
  massa: 'muscle_gain',
  hipertrofia: 'muscle_gain',
}

function generateMeals(
  foods: FoodItem[],
  targetCalories: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
  allergies: string,
  disliked: string,
): DietMeal[] {
  const allergyList = allergies
    .toLowerCase()
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const dislikeList = disliked
    .toLowerCase()
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const safe = foods.filter((f) => {
    const n = f.name.toLowerCase()
    return !allergyList.some((a) => n.includes(a)) && !dislikeList.some((d) => n.includes(d))
  })
  const mealCats = [
    { name: 'Café da Manhã', pct: 0.25 },
    { name: 'Almoço', pct: 0.35 },
    { name: 'Lanche', pct: 0.15 },
    { name: 'Jantar', pct: 0.25 },
  ]
  return mealCats.map((cat) => {
    const cals = Math.round(targetCalories * cat.pct)
    const prot = safe.filter((f) => f.proteinG >= 10)
    const carbs = safe.filter((f) => f.carbsG >= 15 && f.proteinG < 10)
    const fats = safe.filter((f) => f.fatG >= 7 && f.proteinG < 10)
    const selected: DietMeal['foods'] = []
    let remCals = cals
    const pick = (food: FoodItem | undefined, grams: number) => {
      if (!food || remCals <= 0) return
      const ratio = grams / food.servingSizeG
      const c = Math.round(food.calories * ratio)
      selected.push({
        name: food.name,
        grams,
        calories: c,
        proteinG: Math.round(food.proteinG * ratio * 10) / 10,
        carbsG: Math.round(food.carbsG * ratio * 10) / 10,
        fatG: Math.round(food.fatG * ratio * 10) / 10,
      })
      remCals -= c
    }
    pick(prot[0], 150)
    pick(carbs[0], 100)
    if (remCals > 50) pick(fats[0], 15)
    if (remCals > 80) pick(prot[1], 100)
    return {
      category: cat.name,
      foods: selected,
      totalCalories: selected.reduce((a, f) => a + f.calories, 0),
      totalProtein: Math.round(selected.reduce((a, f) => a + f.proteinG, 0)),
      totalCarbs: Math.round(selected.reduce((a, f) => a + f.carbsG, 0)),
      totalFat: Math.round(selected.reduce((a, f) => a + f.fatG, 0)),
    }
  })
}

export function generateDiet(
  answers: Record<string, string>,
  foods: FoodItem[],
  gender: Gender,
): DietPlan {
  const age = parseInt(answers.age) || 28
  const height = parseInt(answers.height) || 178
  const weight = parseFloat(answers.weight) || 78.5
  const goal = GOAL_MAP[answers.goal?.toLowerCase().trim()] || 'maintenance'
  const activity = ACTIVITY_MAP[answers.routine?.toLowerCase().trim()] || 'moderate'
  const bmr = calculateBMR(gender, weight, height, age)
  const tdee = calculateTDEE(bmr, activity)
  const macros = calculateMacroTargets(tdee, goal, weight)
  return {
    targetCalories: macros.calories,
    proteinG: macros.proteinG,
    carbsG: macros.carbsG,
    fatG: macros.fatG,
    meals: generateMeals(
      foods,
      macros.calories,
      macros.proteinG,
      macros.carbsG,
      macros.fatG,
      answers.allergies || '',
      answers.dislikedFoods || '',
    ),
  }
}

export function formatDietPlan(plan: DietPlan): string {
  const meals = plan.meals
    .map((m) => {
      const foods = m.foods
        .map(
          (f) =>
            `  • ${f.name} (${f.grams}g) — ${f.calories} kcal | P:${f.proteinG}g C:${f.carbsG}g G:${f.fatG}g`,
        )
        .join('\n')
      return `\n**${m.category}** (${m.totalCalories} kcal)\n${foods}`
    })
    .join('\n')
  return `🥗 **Plano Alimentar Personalizado**\n\nMeta: ${plan.targetCalories} kcal\nProteínas: ${plan.proteinG}g | Carbs: ${plan.carbsG}g | Gorduras: ${plan.fatG}g\n${meals}\n\n⚠️ Esta dieta é uma sugestão. Não substitui a avaliação de um nutricionista. Ajuste as porções conforme sua fome e resultados.`
}

export function handleDietFlow(
  input: string,
  ctx: AIDataContext,
  session: AISessionState,
): { response: AIResponse; newSession: AISessionState } {
  const question = DIET_QUESTIONS[session.dietStep]
  session.dietAnswers[question.key] = input
  session.dietStep++
  if (session.dietStep < DIET_QUESTIONS.length) {
    const nextQ = DIET_QUESTIONS[session.dietStep]
    return {
      response: {
        text: `✅ Anotado!\n\n**Pergunta ${session.dietStep + 1} de ${DIET_QUESTIONS.length}:**\n${nextQ.question}`,
      },
      newSession: { ...session },
    }
  }
  const newSession = { ...session, pendingFlow: null, dietStep: 0 }
  const plan = generateDiet(session.dietAnswers, ctx.foods, ctx.user.gender)
  const liked =
    session.dietAnswers.likedFoods
      ?.split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean) || []
  newSession.favoriteFoods = [...new Set([...newSession.favoriteFoods, ...liked])]
  return { response: { text: formatDietPlan(plan) }, newSession }
}
