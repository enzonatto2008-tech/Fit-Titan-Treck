import type { AIDataContext, AISessionState, AIResponse } from '@/lib/ai-types'
import {
  generateWorkout,
  generateABCRoutine,
  generateGoalWorkout,
  formatWorkout,
  handleVideoWorkoutFlow,
  extractMuscle,
} from '@/lib/ai-workout'
import { DIET_QUESTIONS, handleDietFlow } from '@/lib/ai-diet'
import { parseRecipeText, formatRecipe, handleRecipeFlow } from '@/lib/ai-recipe'
import {
  explainExercise,
  extractExerciseName,
  generateEvolutionReport,
  generateMotivation,
  generateWeeklyPlan,
  getSafetyResponse,
  isSafetyConcern,
} from '@/lib/ai-knowledge'

export type { AIDataContext, AISessionState, AIAction, AIResponse } from '@/lib/ai-types'

export function createInitialSession(): AISessionState {
  return {
    dataAuthorized: false,
    pendingFlow: null,
    dietStep: 0,
    dietAnswers: {},
    favoriteExercises: [],
    favoriteFoods: [],
    memory: [],
  }
}

const QUICK_ACTIONS = [
  'Quero um treino de peito',
  'Monte minha dieta',
  'Como faz Rosca Scott?',
  'Minha evolução',
  'Plano semanal',
]

export function getQuickActions(): string[] {
  return [...QUICK_ACTIONS]
}

export function generateResponse(
  input: string,
  ctx: AIDataContext,
  session: AISessionState,
): { response: AIResponse; newSession: AISessionState } {
  const newSession: AISessionState = { ...session, dietAnswers: { ...session.dietAnswers } }
  const query = input.toLowerCase().trim()

  if (session.pendingFlow === 'diet') return handleDietFlow(input, ctx, newSession)
  if (session.pendingFlow === 'video_workout') return handleVideoWorkoutFlow(input, ctx, newSession)
  if (session.pendingFlow === 'recipe') return handleRecipeFlow(input, ctx, newSession)

  if (isSafetyConcern(query)) return { response: { text: getSafetyResponse(query) }, newSession }

  if (
    query.includes('youtube.com') ||
    query.includes('youtu.be') ||
    query.includes('instagram.com') ||
    query.includes('tiktok.com')
  ) {
    return {
      response: {
        text: '🔍 Não consigo acessar links externos de YouTube, Instagram ou TikTok.\n\nSe você quer um treino ou receita baseado em um vídeo, cole aqui a descrição ou lista de exercícios/ingredientes.',
      },
      newSession,
    }
  }

  if (query.includes('treino baseado no vídeo') || query.includes('treino baseado no video')) {
    newSession.pendingFlow = 'video_workout'
    return {
      response: {
        text: '🔍 Não consigo acessar conteúdo de vídeos.\n\nPor favor, cole a lista de exercícios ou descrição do vídeo (nomes, séries e repetições se houver). Vou montar o treino!',
      },
      newSession,
    }
  }

  if (query.includes('treino abc')) {
    const routines = generateABCRoutine(ctx.exercises, ctx.user.fitnessGoal)
    return {
      response: {
        text: `💪 Treino ABC completo:\n\n${routines.map(formatWorkout).join('\n\n---\n\n')}\n\nDeseja salvar?`,
        quickActions: ['Salvar treinos'],
      },
      newSession,
    }
  }

  if (query.includes('treino de') || query.includes('quero um treino de')) {
    const muscle = extractMuscle(query)
    const routine = generateWorkout(ctx.exercises, muscle, ctx.user.fitnessGoal)
    newSession.favoriteExercises = [
      ...new Set([...newSession.favoriteExercises, ...routine.exercises.map((e) => e.name)]),
    ]
    return {
      response: {
        text: `💪 Treino de ${muscle}:\n\n${formatWorkout(routine)}\n\nDeseja salvar?`,
        action: { type: 'save_workout', routine },
        quickActions: ['Salvar treino', 'Montar outro treino'],
      },
      newSession,
    }
  }

  if (query.includes('hipertrofia')) {
    const routine = generateGoalWorkout(ctx.exercises, 'muscle_gain')
    return {
      response: {
        text: `💪 Treino para Hipertrofia:\n\n${formatWorkout(routine)}\n\nSéries 8-12 reps, descanso 60-90s. Deseja salvar?`,
        action: { type: 'save_workout', routine },
        quickActions: ['Salvar treino'],
      },
      newSession,
    }
  }

  if (query.includes('emagrecer') || query.includes('perder peso')) {
    const routine = generateGoalWorkout(ctx.exercises, 'weight_loss')
    return {
      response: {
        text: `🔥 Treino para Emagrecimento:\n\n${formatWorkout(routine)}\n\nSéries 15-20 reps, descanso 30-45s + cardio. Deseja salvar?`,
        action: { type: 'save_workout', routine },
        quickActions: ['Salvar treino'],
      },
      newSession,
    }
  }

  if (query.includes('monte minha dieta') || query.includes('monta minha dieta')) {
    newSession.pendingFlow = 'diet'
    newSession.dietStep = 0
    newSession.dietAnswers = {}
    return {
      response: {
        text: `🥗 Vou montar sua dieta personalizada!\n\n**Pergunta 1 de ${DIET_QUESTIONS.length}:**\n${DIET_QUESTIONS[0].question}`,
      },
      newSession,
    }
  }

  if (
    query.includes('como faz') ||
    query.includes('como executar') ||
    query.includes('como fazer')
  ) {
    return {
      response: { text: explainExercise(extractExerciseName(query), ctx.exercises) },
      newSession,
    }
  }

  if (
    query.includes('evolução') ||
    query.includes('evolucao') ||
    query.includes('progresso') ||
    query.includes('meu progresso')
  ) {
    return { response: { text: generateEvolutionReport(ctx) }, newSession }
  }

  if (query.includes('plano semanal') || query.includes('planejamento')) {
    return { response: { text: generateWeeklyPlan(ctx) }, newSession }
  }

  if (query.includes('motiva') || query.includes('ânimo') || query.includes('animo')) {
    return { response: { text: generateMotivation(ctx) }, newSession }
  }

  if (query.includes('http') && (query.includes('receita') || query.includes('recipe'))) {
    newSession.pendingFlow = 'recipe'
    return {
      response: {
        text: '🔍 Não consigo acessar links externos.\n\nCole aqui o texto da receita ou lista de ingredientes.',
      },
      newSession,
    }
  }

  if (
    query.includes('receita') ||
    (input.length > 80 &&
      (query.includes('ingredient') ||
        query.includes('modo de preparo') ||
        query.includes('colher') ||
        query.includes('xícara') ||
        query.includes('assar') ||
        query.includes('cozinhar')))
  ) {
    const result = parseRecipeText(input)
    if (result.recipe)
      return {
        response: {
          text: formatRecipe(result),
          action: { type: 'save_recipe', recipe: result.recipe },
          quickActions: ['Salvar receita'],
        },
        newSession,
      }
    if (result.needsText) {
      newSession.pendingFlow = 'recipe'
      return { response: { text: result.message || 'Cole o texto da receita.' }, newSession }
    }
  }

  const memoryNote =
    newSession.favoriteExercises.length > 0
      ? `\n\n💡 Lembrei que você gosta de: ${newSession.favoriteExercises.slice(0, 3).join(', ')}.`
      : ''
  return {
    response: {
      text: `Como seu Personal Trainer e Nutricionista, posso te ajudar com:\n\n💪 Criar treinos personalizados\n🥗 Montar dietas\n🍳 Analisar receitas\n📋 Explicar exercícios\n📊 Acompanhar evolução\n🗓️ Planejar sua semana\n\nO que você precisa hoje?${memoryNote}`,
      quickActions: QUICK_ACTIONS.slice(0, 4),
    },
    newSession,
  }
}
