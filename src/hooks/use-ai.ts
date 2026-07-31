import { useContext } from 'react'
import { AiContext } from '@/context/AiContext'

export function useAi() {
  const context = useContext(AiContext)
  if (!context) {
    throw new Error('useAi must be used within an AiProvider')
  }
  return context
}
