import { useState, useRef, useEffect } from 'react'
import { useAi } from '@/hooks/use-ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Sparkles, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AiFloatingPanel() {
  const { messages, isPanelOpen, setPanelOpen, sendMessage, authorizeData, executeAction } = useAi()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleQuickAction = (action: string) => {
    if (action.includes('Autorizar')) {
      authorizeData()
      return
    }
    if (action.includes('Salvar')) {
      const lastWithAction = [...messages].reverse().find((m) => m.action)
      if (lastWithAction?.action) {
        executeAction(lastWithAction.action)
        return
      }
    }
    sendMessage(action)
  }

  return (
    <>
      <Button
        onClick={() => setPanelOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 h-14 w-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg flex items-center justify-center p-0 transition-transform hover:scale-105',
          isPanelOpen && 'hidden',
        )}
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      <Sheet open={isPanelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-500" />
              AI Fitness Coach
            </SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn('flex gap-2', m.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.sender === 'ai' && (
                  <div className="h-7 w-7 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="space-y-2 max-w-[85%]">
                  <div
                    className={cn(
                      'p-3 rounded-xl text-xs whitespace-pre-wrap',
                      m.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-accent/60 border border-border rounded-bl-none',
                    )}
                  >
                    {m.text}
                  </div>
                  {m.quickActions && m.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(qa)}
                          className="text-[11px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 hover:bg-violet-500/20 transition"
                        >
                          {qa}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre treino, dieta..."
              className="text-xs h-9"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-violet-600 hover:bg-violet-700 h-9 w-9 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
