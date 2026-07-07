import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wcWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wcWeightUnit: z.string().min(1), wcMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wcPace: z.string().min(1) }),
  fields: [
    { name: 'wcWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'wcWeightUnit', label: 'Weight Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'wcMinutes', label: 'Walking Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'wcPace', label: 'Walking Pace', type: 'select', options: [{ label: 'Slow (2 mph / 3.2 kmh)', value: 'slow' }, { label: 'Moderate (3 mph / 4.8 kmh)', value: 'moderate' }, { label: 'Brisk (3.5 mph / 5.6 kmh)', value: 'brisk' }, { label: 'Fast (4 mph / 6.4 kmh)', value: 'fast' }] },
  ],
  compute: (v) => {
    const weightKg = v.wcWeightUnit === 'lb' ? v.wcWeight * 0.453592 : v.wcWeight
    const metValues: Record<string, number> = { slow: 2.8, moderate: 3.5, brisk: 4.3, fast: 5 }
    const met = metValues[v.wcPace] || 3.5
    const calories = met * 3.5 * weightKg / 200 * v.wcMinutes
    const paceSpeeds: Record<string, number> = { slow: 3.2, moderate: 4.8, brisk: 5.6, fast: 6.4 }
    const distanceKm = (paceSpeeds[v.wcPace] || 3.5) * v.wcMinutes / 60
    const steps = Math.round(distanceKm * 1312)
    return { result: calories, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Weight', value: weightKg.toFixed(1) + ' kg' }, { label: 'MET Value', value: '' + met }, { label: 'Duration', value: v.wcMinutes + ' min' }, { label: 'Calories', value: calories.toFixed(0) + ' kcal' }, { label: 'Est Distance', value: distanceKm.toFixed(2) + ' km' }, { label: 'Est Steps', value: '' + steps }] }
  },
  description: 'Calculate calories burned while walking based on body weight, duration, pace, and distance. Uses MET values for accuracy.',
  formula: 'Calories = MET x 3.5 x Weight(kg) / 200 x Minutes | MET: Slow 2.8, Moderate 3.5, Brisk 4.3, Fast 5.0',
  interpretation: 'A 70kg person burns ~120 kcal walking 30 min at moderate pace (3 mph). Brisk walking burns 30% more calories. Walking 10,000 steps/day burns ~300-500 kcal. Walking after meals aids digestion and blood sugar control.'
}

export default calcDef
