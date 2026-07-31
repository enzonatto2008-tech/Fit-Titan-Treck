import { useState } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
}

export default function AiAssistant() {
  const { user, mealLogs, waterLogs } = useFitness()
  const todayStr = new Date().toISOString().split('T')[0]
  const todayMeals = mealLogs.filter((m) => m.date === todayStr)
  const todayCalories = todayMeals.reduce((a, b) => a + b.calories, 0)
  const todayProt = todayMeals.reduce((a, b) => a + b.proteinG, 0)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Olá ${user.name}! Sou o FitTrack AI Coach. Analisei seus dados de hoje: você consumiu ${todayCalories} kcal e ${todayProt.toFixed(0)}g de proteína até o momento. Como posso te ajudar agora?`,
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Rule-based response engine
    setTimeout(() => {
      let responseText =
        'Com base no seu objetivo de ' +
        user.fitnessGoal.replace('_', ' ') +
        ', recomendo manter a consistência nos treinos e bater sua meta diária de água de ' +
        user.waterTargetMl +
        'ml.'

      const query = input.toLowerCase()
      if (query.includes('dieta') || query.includes('refeição') || query.includes('hoje')) {
        responseText =
          `Sua meta é de ${user.dailyCaloriesTarget} kcal. Hoje você registrou ${todayCalories} kcal. ` +
          (todayProt < user.proteinTargetG
            ? `Dica: você ainda precisa de ${(user.proteinTargetG - todayProt).toFixed(0)}g de proteína para bater sua meta diária.`
            : `Parabéns! Sua ingestão de proteína está ótima hoje.`)
      } else if (query.includes('treino') || query.includes('exercício')) {
        responseText = `Para seu perfil, recomendo manter a frequência de ${user.weeklyWorkoutsTarget} treinos por semana, priorizando progressão de carga com descanso de 60s a 90s entre séries.`
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText },
      ])
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-500" /> AI Fitness Coach
        </h1>
        <p className="text-xs text-muted-foreground">
          Assistente inteligente integrado com seu histórico e métricas diárias.
        </p>
      </div>

      <Card className="flex-1 border-border p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="h-8 w-8 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-xl max-w-[80%] ${
                m.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-br-none'
                  : 'bg-accent/60 border border-border rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="h-8 w-8 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </Card>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre sua dieta, treino ou sugestões..."
          className="text-xs"
        />
        <Button type="submit" className="bg-violet-600 text-white gap-2 text-xs">
          <Send className="h-4 w-4" /> Enviar
        </Button>
      </form>
    </div>
  )
}
