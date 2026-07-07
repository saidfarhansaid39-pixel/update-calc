import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), goal: z.string().min(1), activityLevel: z.string().min(1) }),
  fields: [
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '10' },
    { name: 'goal', label: 'Diet Goal', type: 'select', options: [{ label: 'Lose Weight', value: 'lose' }, { label: 'Maintain', value: 'maintain' }, { label: 'Gain Muscle', value: 'gain' }] },
    { name: 'activityLevel', label: 'Activity Level', type: 'select', options: [{ label: 'Sedentary', value: 'sedentary' }, { label: 'Light (1-3 days)', value: 'light' }, { label: 'Moderate (3-5 days)', value: 'moderate' }, { label: 'Active (6-7 days)', value: 'active' }, { label: 'Very Active (2x/day)', value: 'veryActive' }] },
  ],
  compute: (v) => {
    const weightKg = v.weight * 0.453592
    // macro-calc schema has no height/age fields, so use defaults
    const hVal = 175
    const aVal = 30
    const bmr = 10 * weightKg + 6.25 * hVal - 5 * aVal + 5
    const activityMultipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }
    const tdee = bmr * activityMultipliers[v.activityLevel as keyof typeof activityMultipliers]
    const goalCalories = v.goal === 'lose' ? tdee - 500 : v.goal === 'gain' ? tdee + 300 : tdee
    const protein = weightKg * 2
    const fat = weightKg * 0.8
    const carbs = (goalCalories - protein * 4 - fat * 9) / 4
    return { result: goalCalories, label: 'Daily Calories', unit: 'kcal', steps: [{ label: 'BMR', value: `${bmr.toFixed(0)} kcal` }, { label: 'TDEE', value: `${tdee.toFixed(0)} kcal` }, { label: 'Adjusted Calories', value: `${goalCalories.toFixed(0)} kcal` }, { label: 'Protein', value: `${protein.toFixed(0)}g (${(protein * 4).toFixed(0)} kcal)` }, { label: 'Fat', value: `${fat.toFixed(0)}g (${(fat * 9).toFixed(0)} kcal)` }, { label: 'Carbs', value: `${Math.max(0, carbs).toFixed(0)}g (${(Math.max(0, carbs) * 4).toFixed(0)} kcal)` }] }
  },
  description: 'Calculate recommended daily macronutrients (protein, fat, carbs) based on weight, diet goal, and activity level.',
  formula: 'TDEE = BMR × Activity | Calories = TDEE ± Adjustment | Protein = 2g/kg, Fat = 0.8g/kg, Carbs = remaining',
  interpretation: 'Protein: 1.6-2.2 g/kg for muscle gain, 1.2-1.6 g/kg for maintenance. Fat: 0.5-1 g/kg. Carbs fill remaining calories. Adjust based on individual response.'
}

export default calcDef
