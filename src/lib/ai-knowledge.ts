import type { Exercise } from '@/types/fitness'
import type { AIDataContext } from '@/lib/ai-types'

interface ExerciseInfo {
  execution: string
  muscles: string
  mistakes: string
  tips: string
}

const KNOWLEDGE: Record<string, ExerciseInfo> = {
  'rosca scott': {
    execution:
      'Sente-se no aparelho com os braços apoiados na almofada inclinada. Segure a barra com pegada supinada. Flexione os cotovelos levantando o peso em direção aos ombros. Desça controladamente.',
    muscles: 'Bíceps braquial (foco na cabeça curta), braquial e antebraço.',
    mistakes:
      'Balançar o corpo para levantar o peso, não descer completamente, usar muito peso e perder a postura.',
    tips: 'Mantenha os braços firmemente apoiados na almofada. Foco na contração do bíceps. Tempo controlado: 2s subida, 3s descida.',
  },
  'supino reto': {
    execution:
      'Deite-se no banco com os pés firmes no chão. Segure a barra com pegada mais larga que os ombros. Desça a barra até o peito e empurre para cima estendendo os braços.',
    muscles: 'Peitoral maior, deltoides anterior e tríceps.',
    mistakes:
      'Arquear demais as costas, quicar a barra no peito, não controlar a descida, cotovelos muito abertos.',
    tips: 'Retraia as escápulas, mantenha o core firme. Desça até tocar levemente o peito. Use segurador para pesos pesados.',
  },
  agachamento: {
    execution:
      'Com a barra nos ombros, pés na largura dos ombros. Flexione joelhos e quadril simultaneamente, como se sentasse. Desça até paralelo ou abaixo. Suba estendendo pernas e quadril.',
    muscles: 'Quadríceps, glúteos, posteriores de coxa, core e panturrilhas.',
    mistakes:
      'Joelhos caindo para dentro, costas arredondadas, subir os calcanhares, não descer o suficiente.',
    tips: 'Mantenha o peito erguido, peso nos calcanhares. Comece leve para dominar a técnica. Use cinto para cargas altas.',
  },
  'levantamento terra': {
    execution:
      'Com a barra no chão, pés sob a barra. Flexione quadris e joelhos, segure a barra. Estenda pernas e quadril simultaneamente, mantendo as costas retas. Volte controladamente.',
    muscles: 'Posterior de coxa, glúteos, eretores da espinha, traps e antebraços.',
    mistakes: 'Costas arredondadas, barra longe do corpo, puxar com os braços, não usar as pernas.',
    tips: 'Mantenha a barra próxima ao corpo. Core firme, costas neutras. Aprenda a técnica antes de aumentar carga.',
  },
  desenvolvimento: {
    execution:
      'Sentado ou em pé, segure halteres na altura dos ombros. Empurre os pesos para cima até estender os braços. Desça controladamente até a altura dos ombros.',
    muscles: 'Deltoides (principalmente anterior), tríceps e trapézio superior.',
    mistakes:
      'Arquear as costas, usar impulso das pernas, não controlar a descida, cotovelos bloqueados.',
    tips: 'Mantenha o core firme e costas neutras. Não force a extensão total se causar desconforto. Respire ao descer.',
  },
}

const SAFETY_KEYWORDS = [
  'esteroide',
  'anabolizante',
  'hormônio',
  'hormonio',
  'medicamento',
  'remédio',
  'clenbuterol',
  'oxandrolona',
  'dianabol',
  'dosagem',
]

export function isSafetyConcern(query: string): boolean {
  return SAFETY_KEYWORDS.some((k) => query.includes(k))
}

export function getSafetyResponse(query: string): string {
  if (
    query.includes('esteroide') ||
    query.includes('anabolizante') ||
    query.includes('clenbuterol') ||
    query.includes('oxandrolona') ||
    query.includes('dianabol')
  ) {
    return '⚠️ **Aviso de Segurança**\n\nNão posso recomendar, encorajar ou fornecer informações sobre o uso de substâncias ilegais ou anabolizantes. O uso dessas substâncias sem prescrição é ilegal e extremamente perigoso.\n\nSe você busca ganho de massa muscular, posso ajudar com estratégias naturais de treino e nutrição. Consulte um médico para avaliação hormonal.'
  }
  if (
    query.includes('hormônio') ||
    query.includes('hormonio') ||
    query.includes('medicamento') ||
    query.includes('remédio') ||
    query.includes('dosagem')
  ) {
    return '⚠️ **Aviso de Segurança**\n\nNão posso recomendar dosagens de medicamentos ou hormônios. Isso deve ser avaliado exclusivamente por um médico ou endocrinologista com exames específicos.\n\nPosso ajudar com treino, nutrição e suplementação esportiva básica. Para questões médicas, consulte sempre um profissional.'
  }
  return '⚠️ Não posso fornecer esse tipo de informação. Consulte um profissional de saúde qualificado.'
}

export function extractExerciseName(query: string): string {
  return query
    .replace(/como faz(er)?\s*/i, '')
    .replace(/\?/g, '')
    .trim()
}

export function explainExercise(name: string, exercises: Exercise[]): string {
  const lower = name.toLowerCase()
  const key = Object.keys(KNOWLEDGE).find((k) => lower.includes(k))
  if (key) {
    const info = KNOWLEDGE[key]
    return `🏋️ **${name}**\n\n**Execução:**\n${info.execution}\n\n**Músculos Trabalhados:**\n${info.muscles}\n\n**Erros Comuns:**\n${info.mistakes}\n\n**Dicas Importantes:**\n${info.tips}\n\n⚠️ A execução correta é mais importante que a carga. Consulte um profissional de educação física para orientação presencial.`
  }
  const matched = exercises.find(
    (e) => lower.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(lower),
  )
  if (matched) {
    return `🏋️ **${matched.name}**\n\n**Músculo Alvo:** ${matched.targetMuscle}\n**Sugestão:** ${matched.defaultSets} séries de ${matched.defaultReps} reps com ${matched.defaultWeightKg}kg e ${matched.defaultRestSeconds}s de descanso.\n\nPara execução segura, consulte um profissional de educação física.\n\n⚠️ Esta orientação não substitui a avaliação de um profissional.`
  }
  return `Não tenho uma explicação detalhada para "${name}". No entanto, recomendo sempre:\n\n1. Aquecer antes do exercício\n2. Começar com carga leve para dominar a técnica\n3. Manter postura correta\n4. Consultar um profissional de educação física\n\n⚠️ Esta orientação não substitui a avaliação de um profissional.`
}

export function generateEvolutionReport(ctx: AIDataContext): string {
  const { user, weightEntries, mealLogs, waterLogs, sleepLogs, sessions } = ctx
  const today = new Date().toISOString().split('T')[0]
  const todayMeals = mealLogs.filter((m) => m.date === today)
  const todayCals = todayMeals.reduce((a, m) => a + m.calories, 0)
  const todayProtein = todayMeals.reduce((a, m) => a + m.proteinG, 0)
  const todayWater = waterLogs.filter((w) => w.date === today).reduce((a, w) => a + w.amountMl, 0)
  const lastSleep = sleepLogs[0]
  const recentWeights = weightEntries.slice(-5)
  const lines: string[] = ['📊 **Relatório de Evolução**\n']
  if (recentWeights.length >= 2) {
    const diff = recentWeights[recentWeights.length - 1].weightKg - recentWeights[0].weightKg
    lines.push(
      `• Você ${diff < 0 ? 'perdeu' : 'ganhou'} ${Math.abs(diff).toFixed(1)}kg desde ${recentWeights[0].date}.`,
    )
  }
  lines.push(`• Você registrou ${sessions.length} treinos no total.`)
  lines.push(`• Hoje consumiu ${todayCals} kcal de ${user.dailyCaloriesTarget} kcal planejadas.`)
  if (todayProtein < user.proteinTargetG) {
    lines.push(
      `• ⚠️ Sua proteína (${todayProtein.toFixed(0)}g) está abaixo da meta (${user.proteinTargetG}g).`,
    )
  } else {
    lines.push(`• ✅ Proteína está ótima: ${todayProtein.toFixed(0)}g.`)
  }
  lines.push(`• Hidratação hoje: ${todayWater}ml de ${user.waterTargetMl}ml.`)
  if (lastSleep)
    lines.push(`• Último sono: ${lastSleep.hoursSlept}h (qualidade: ${lastSleep.qualityStars}/5).`)
  lines.push('\n📈 Continue registrando seus dados para análises mais precisas.')
  lines.push(
    '\n⚠️ Esta análise é baseada nos dados disponíveis no app. Para avaliação completa, consulte profissionais.',
  )
  return lines.join('\n')
}

export function generateMotivation(ctx: AIDataContext): string {
  const { user, mealLogs, waterLogs, sessions, weightEntries } = ctx
  const today = new Date().toISOString().split('T')[0]
  const todayWater = waterLogs.filter((w) => w.date === today).reduce((a, w) => a + w.amountMl, 0)
  const waterRem = user.waterTargetMl - todayWater
  const msgs: string[] = []
  if (waterRem > 0 && waterRem <= 500)
    msgs.push(`Faltam apenas ${waterRem}ml de água para sua meta! 💧`)
  if (sessions.length > 0)
    msgs.push(`Você já completou ${sessions.length} treinos. Continue firme! 💪`)
  if (weightEntries.length >= 2) {
    const diff = weightEntries[0].weightKg - weightEntries[weightEntries.length - 1].weightKg
    if (diff > 0) msgs.push(`Você já perdeu ${diff.toFixed(1)}kg! Continue assim! 🎯`)
  }
  if (mealLogs.filter((m) => m.date === today).length === 0)
    msgs.push('Você ainda não registrou refeições hoje. Que tal começar? 🍽️')
  msgs.push('💪 Você está no caminho certo! Cada treino é um investimento na sua saúde.')
  msgs.push('🔥 Consistência é a chave. Continue firme nos seus objetivos!')
  return msgs[Math.floor(Math.random() * msgs.length)]
}

export function generateWeeklyPlan(ctx: AIDataContext): string {
  const { user, routines } = ctx
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const workoutDays = user.weeklyWorkoutsTarget
  const plan: string[] = [
    `🗓️ **Plano Semanal Personalizado**\n\n**Objetivo:** ${user.fitnessGoal.replace('_', ' ')}\n**Treinos/semana:** ${workoutDays}\n`,
  ]
  const workoutIndices = [0, 2, 4, 6].slice(0, workoutDays)
  days.forEach((day, i) => {
    if (workoutIndices.includes(i)) {
      const r = routines[i % Math.max(1, routines.length)]
      plan.push(`**${day}:** Treino — ${r?.name || 'Treino completo'} + 5min aquecimento`)
    } else if (i === 1 || i === 5) {
      plan.push(`**${day}:** Cardio leve (20-30min) + Mobilidade`)
    } else {
      plan.push(`**${day}:** Descanso ativo — Caminhada leve, alongamento`)
    }
  })
  plan.push(`\n💧 **Hidratação:** ${user.waterTargetMl}ml/dia`)
  plan.push(
    `🥗 **Alimentação:** ${user.dailyCaloriesTarget} kcal/dia (P:${user.proteinTargetG}g C:${user.carbsTargetG}g G:${user.fatTargetG}g)`,
  )
  plan.push(`😴 **Sono:** 7-8h por noite`)
  plan.push(`\n⚠️ Ajuste o plano conforme sua rotina. Consulte profissionais para personalização.`)
  return plan.join('\n')
}
