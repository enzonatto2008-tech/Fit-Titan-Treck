import type { Exercise, WorkoutRoutine, RoutineExercise, FitnessGoal } from '@/types/fitness'
import type { AIDataContext, AISessionState, AIResponse } from '@/lib/ai-types'

const MUSCLE_MAP: Record<string, string> = {
  peito: 'Peitoral',
  peitoral: 'Peitoral',
  costa: 'Costas',
  costas: 'Costas',
  perna: 'Quadríceps',
  pernas: 'Quadríceps',
  quadriceps: 'Quadríceps',
  posterior: 'Posterior',
  gluteo: 'Glúteos',
  glúteo: 'Glúteos',
  gluteos: 'Glúteos',
  ombro: 'Ombros',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  bíceps: 'Bíceps',
  triceps: 'Tríceps',
  tríceps: 'Tríceps',
  abdômen: 'Abdômen',
  abdomen: 'Abdômen',
  abdominal: 'Abdômen',
  core: 'Abdômen',
  panturrilha: 'Panturrilha',
  antebraco: 'Antebraço',
  antebraço: 'Antebraço',
}

export function extractMuscle(query: string): string {
  for (const [key, value] of Object.entries(MUSCLE_MAP)) {
    if (query.includes(key)) return value
  }
  return 'Peitoral'
}

function pickExercises(exercises: Exercise[], muscle: string, count: number): Exercise[] {
  const filtered = exercises.filter((e) => e.targetMuscle === muscle)
  if (filtered.length >= count) return filtered.slice(0, count)
  const others = exercises.filter((e) => e.targetMuscle !== muscle)
  return [...filtered, ...others].slice(0, count)
}

function buildRoutineExercise(ex: Exercise, goal: FitnessGoal): RoutineExercise {
  const isWeightLoss = goal === 'weight_loss'
  return {
    exerciseId: ex.id,
    name: ex.name,
    targetMuscle: ex.targetMuscle,
    sets: isWeightLoss ? 4 : ex.defaultSets,
    reps: isWeightLoss ? 20 : ex.defaultReps,
    weightKg: ex.defaultWeightKg,
    restSeconds: isWeightLoss ? 30 : ex.defaultRestSeconds,
  }
}

export function generateWorkout(
  exercises: Exercise[],
  muscle: string,
  goal: FitnessGoal,
): WorkoutRoutine {
  const picked = pickExercises(exercises, muscle, 5)
  return {
    id: `ai_${Date.now()}`,
    name: `Treino AI - ${muscle}`,
    description: `Treino gerado pelo AI Coach focado em ${muscle}.`,
    exercises: picked.map((e) => buildRoutineExercise(e, goal)),
  }
}

export function generateABCRoutine(exercises: Exercise[], goal: FitnessGoal): WorkoutRoutine[] {
  const split: { name: string; muscles: string[] }[] = [
    { name: 'Treino A', muscles: ['Peitoral', 'Tríceps'] },
    { name: 'Treino B', muscles: ['Costas', 'Bíceps'] },
    { name: 'Treino C', muscles: ['Quadríceps', 'Posterior', 'Abdômen'] },
  ]
  return split.map((s) => {
    const exs: Exercise[] = []
    s.muscles.forEach((m) => {
      exs.push(...exercises.filter((e) => e.targetMuscle === m).slice(0, 3))
    })
    return {
      id: `ai_abc_${Date.now()}_${s.name}`,
      name: s.name,
      description: `Treino ABC gerado pelo AI Coach - ${s.muscles.join(', ')}.`,
      exercises: exs.slice(0, 6).map((e) => buildRoutineExercise(e, goal)),
    }
  })
}

export function generateGoalWorkout(exercises: Exercise[], goal: FitnessGoal): WorkoutRoutine {
  const muscles =
    goal === 'weight_loss'
      ? ['Quadríceps', 'Peitoral', 'Costas', 'Abdômen', 'Cardio']
      : ['Peitoral', 'Costas', 'Quadríceps', 'Ombros']
  const exs: Exercise[] = []
  muscles.forEach((m) => {
    exs.push(...exercises.filter((e) => e.targetMuscle === m).slice(0, 2))
  })
  return {
    id: `ai_goal_${Date.now()}`,
    name: goal === 'weight_loss' ? 'Treino AI - Emagrecimento' : 'Treino AI - Hipertrofia',
    description: `Treino gerado para ${goal === 'weight_loss' ? 'emagrecimento' : 'hipertrofia'}.`,
    exercises: exs.slice(0, 6).map((e) => buildRoutineExercise(e, goal)),
  }
}

export function parseVideoWorkout(text: string, exercises: Exercise[]): WorkoutRoutine {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const routineExercises: RoutineExercise[] = []
  const estimated: string[] = []

  lines.forEach((line, idx) => {
    const lower = line.toLowerCase()
    const matched = exercises.find((e) => lower.includes(e.name.toLowerCase()))
    if (matched) {
      const sets = parseInt(lower.match(/(\d+)\s*[sx×]/)?.[1] || '4')
      const reps = parseInt(lower.match(/(\d+)\s*rep/)?.[1] || String(matched.defaultReps))
      routineExercises.push({
        exerciseId: matched.id,
        name: matched.name,
        targetMuscle: matched.targetMuscle,
        sets: sets || matched.defaultSets,
        reps: reps || matched.defaultReps,
        weightKg: matched.defaultWeightKg,
        restSeconds: matched.defaultRestSeconds,
      })
    } else if (line.length > 3) {
      estimated.push(line)
      routineExercises.push({
        exerciseId: `est_${idx}`,
        name: line.replace(/^\d+[-.)]\s*/, ''),
        targetMuscle: 'A definir',
        sets: 4,
        reps: 12,
        weightKg: 0,
        restSeconds: 60,
      })
    }
  })

  return {
    id: `ai_video_${Date.now()}`,
    name: 'Treino AI - Baseado em Vídeo',
    description:
      estimated.length > 0
        ? `⚠️ Exercícios estimados: ${estimated.length}. Valores podem precisar de ajuste.`
        : 'Treino extraído de descrição de vídeo.',
    exercises: routineExercises,
  }
}

export function formatWorkout(routine: WorkoutRoutine): string {
  const lines = routine.exercises.map(
    (ex, i) =>
      `${i + 1}. ${ex.name} (${ex.targetMuscle}) — ${ex.sets}x${ex.reps}, ${ex.weightKg}kg, ${ex.restSeconds}s descanso`,
  )
  const note = routine.description?.includes('⚠️') ? `\n\n${routine.description}` : ''
  return `**${routine.name}**\n${lines.join('\n')}${note}`
}

export function handleVideoWorkoutFlow(
  input: string,
  ctx: AIDataContext,
  session: AISessionState,
): { response: AIResponse; newSession: AISessionState } {
  const routine = parseVideoWorkout(input, ctx.exercises)
  if (routine.exercises.length === 0) {
    return {
      response: {
        text: 'Não consegui identificar exercícios no texto. Pode listar os exercícios um por linha? Ex:\n1. Supino Reto - 4x10\n2. Agachamento - 4x8',
      },
      newSession: { ...session, pendingFlow: 'video_workout' },
    }
  }
  const hasEstimates = routine.description?.includes('⚠️')
  return {
    response: {
      text: `🎬 Treino criado a partir do seu texto!\n\n${formatWorkout(routine)}\n\n${hasEstimates ? '⚠️ Alguns valores foram estimados. Revise antes de salvar.' : 'Deseja salvar este treino?'}`,
      action: { type: 'save_workout', routine },
      quickActions: ['Salvar treino'],
    },
    newSession: { ...session, pendingFlow: null },
  }
}
