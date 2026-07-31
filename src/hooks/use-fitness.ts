import { useContext } from 'react'
import { FitnessContext, FitnessContextType } from '@/context/FitnessContext'

export function useFitness(): FitnessContextType {
  const context = useContext(FitnessContext)
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider')
  }
  return context
}
