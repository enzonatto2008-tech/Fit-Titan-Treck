import { createContext, useState, useCallback, ReactNode } from 'react'
import { useFitness } from '@/hooks/use-fitness'
import { generateResponse, createInitialSession, getQuickActions } from '@/lib/ai-engine'
import type { AISessionState, AIAction } from '@/lib/ai-types'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  action?: AIAction
  quickActions?: string[]
}

interface AiContextType {
  messages: Message[]
  session: AISessionState
  isPanelOpen: boolean
  authorizeData: () => void
  togglePanel: () => void
  setPanelOpen: (open: boolean) => void
  sendMessage: (text: string) => void
  clearMessages: () => void
  executeAction: (action: AIAction) => void
}

export const AiContext = createContext<AiContextType | undefined>(undefined)

const INITIAL_MESSAGE: Message = {
  id: '1',
  sender: 'ai',
  text: 'Olá! Sou seu **Personal Trainer, Nutricionista e Coach de Hábitos**, especializado em Hipertrofia, Emagrecimento, Cutting, Bulking, Recomposição Corporal, Performance e Saúde.\n\nPara oferecer recomendações personalizadas, preciso de autorização para acessar seus dados no app (peso, treinos, alimentação, água, sono, metas e progresso).\n\nDeseja autorizar?',
  quickActions: ['✅ Autorizar acesso aos dados'],
}

export const AiProvider = ({ children }: { children: ReactNode }) => {
  const fitness = useFitness()
  const [session, setSession] = useState<AISessionState>(createInitialSession)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])

  const authorizeData = useCallback(() => {
    setSession((prev) => ({ ...prev, dataAuthorized: true }))
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: '✅ Obrigado! Agora tenho acesso aos seus dados e vou usá-los para personalizar todas as recomendações.\n\nNota: Estou usando os dados disponíveis no app. Se algum dado parecer incorreto, atualize-o nas respectivas seções.\n\nComo posso te ajudar hoje?',
        quickActions: getQuickActions(),
      },
    ])
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text }])

      if (!session.dataAuthorized && !text.toLowerCase().includes('autorizar')) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: 'Para personalizar minhas recomendações, preciso que você autorize o acesso aos seus dados primeiro.',
              quickActions: ['✅ Autorizar acesso aos dados'],
            },
          ])
        }, 500)
        return
      }

      setTimeout(() => {
        const ctx = {
          user: fitness.user,
          mealLogs: fitness.mealLogs,
          weightEntries: fitness.weightEntries,
          waterLogs: fitness.waterLogs,
          sleepLogs: fitness.sleepLogs,
          sessions: fitness.sessions,
          routines: fitness.routines,
          exercises: fitness.exercises,
          foods: fitness.foods,
        }
        const { response, newSession } = generateResponse(text, ctx, session)
        setSession(newSession)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: response.text,
            action: response.action,
            quickActions: response.quickActions,
          },
        ])
      }, 600)
    },
    [fitness, session],
  )

  const executeAction = useCallback(
    (action: AIAction) => {
      if (action.type === 'save_workout') {
        fitness.saveRoutine(action.routine)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: '✅ Treino salvo na sua biblioteca! Você pode visualizá-lo na aba Treinos.',
          },
        ])
      } else if (action.type === 'save_recipe') {
        const saved = localStorage.getItem('fit_recipes')
        const recipes = saved ? JSON.parse(saved) : []
        const newRecipe = { ...action.recipe, id: `recipe_${Date.now()}` }
        localStorage.setItem('fit_recipes', JSON.stringify([newRecipe, ...recipes]))
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: '✅ Receita salva! Você pode visualizá-la na aba Receitas.',
          },
        ])
      }
    },
    [fitness],
  )

  const togglePanel = useCallback(() => setIsPanelOpen((p) => !p), [])
  const setPanelOpen = useCallback((open: boolean) => setIsPanelOpen(open), [])
  const clearMessages = useCallback(() => {
    setSession(createInitialSession())
    setMessages([INITIAL_MESSAGE])
  }, [])

  return (
    <AiContext.Provider
      value={{
        messages,
        session,
        isPanelOpen,
        authorizeData,
        togglePanel,
        setPanelOpen,
        sendMessage,
        clearMessages,
        executeAction,
      }}
    >
      {children}
    </AiContext.Provider>
  )
}
