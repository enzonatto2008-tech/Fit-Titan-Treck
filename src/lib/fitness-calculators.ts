import { Gender, ActivityLevel, FitnessGoal } from '@/types/fitness'

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(1))
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso'
  if (bmi < 25) return 'Peso normal'
  if (bmi < 30) return 'Sobrepeso'
  if (bmi < 35) return 'Obesidade I'
  if (bmi < 40) return 'Obesidade II'
  return 'Obesidade III'
}

export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161)
}

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * (ACTIVITY_FACTORS[activityLevel] || 1.55))
}

export function calculateBodyFat(
  gender: Gender,
  waistCm: number,
  neckCm: number,
  heightCm: number,
  hipCm?: number,
): number {
  try {
    if (gender === 'male') {
      const diff = waistCm - neckCm
      if (diff <= 0) return 0
      const value = 86.01 * Math.log10(diff) - 70.041 * Math.log10(heightCm) + 36.76
      return Number(Math.max(0, Math.min(60, value)).toFixed(1))
    }
    const hip = hipCm || waistCm
    const diff = waistCm + hip - neckCm
    if (diff <= 0) return 0
    const value = 163.205 * Math.log10(diff) - 97.684 * Math.log10(heightCm) - 78.387
    return Number(Math.max(0, Math.min(60, value)).toFixed(1))
  } catch {
    return 0
  }
}

export function calculateMacroTargets(
  tdee: number,
  goal: FitnessGoal,
  weightKg: number,
): { calories: number; proteinG: number; carbsG: number; fatG: number } {
  let calories = tdee
  if (goal === 'weight_loss') calories = Math.round(tdee - 500)
  if (goal === 'muscle_gain') calories = Math.round(tdee + 300)

  const proteinG = Math.round(weightKg * 2.0)
  const fatG = Math.round(weightKg * 0.8)
  const carbsG = Math.round(Math.max(50, (calories - (proteinG * 4 + fatG * 9)) / 4))

  return { calories, proteinG, carbsG, fatG }
}

export function getBodyFatCategory(bf: number, gender: Gender): string {
  if (gender === 'male') {
    if (bf < 6) return 'Essencial'
    if (bf < 14) return 'Atleta'
    if (bf < 18) return 'Fitness'
    if (bf < 25) return 'Aceitável'
    return 'Elevado'
  }
  if (bf < 14) return 'Essencial'
  if (bf < 21) return 'Atleta'
  if (bf < 25) return 'Fitness'
  if (bf < 32) return 'Aceitável'
  return 'Elevado'
}
