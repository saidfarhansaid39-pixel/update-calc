import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ yoWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yoWeightUnit: z.string().min(1), yoMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yoStyle: z.string().min(1) }),
  fields: [
    { name: 'yoWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'yoWeightUnit', label: 'Weight Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'yoMinutes', label: 'Yoga Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'yoStyle', label: 'Yoga Style', type: 'select', options: [{ label: 'Hatha (Gentle)', value: 'hatha' }, { label: 'Vinyasa (Flowing)', value: 'vinyasa' }, { label: 'Power Yoga', value: 'power' }, { label: 'Bikram/Hot Yoga', value: 'bikram' }] },
  ],
  compute: (v) => {
    const weightKg = v.yoWeightUnit === 'lb' ? v.yoWeight * 0.453592 : v.yoWeight
    const metValues: Record<string, number> = { hatha: 2.5, vinyasa: 4, power: 5.5, bikram: 6.5 }
    const met = metValues[v.yoStyle] || 3
    const calories = met * 3.5 * weightKg / 200 * v.yoMinutes
    const totalMetMins = met * v.yoMinutes
    return { result: calories, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Weight', value: weightKg.toFixed(1) + ' kg' }, { label: 'Yoga Style', value: v.yoStyle + ' (MET: ' + met + ')' }, { label: 'Duration', value: v.yoMinutes + ' min' }, { label: 'Calories Burned', value: calories.toFixed(0) + ' kcal' }, { label: 'MET-minutes', value: totalMetMins.toFixed(0) }] }
  },
  description: 'Calculate calories burned during yoga based on body weight, session duration, and yoga style (Hatha, Vinyasa, Power, or Hot Yoga).',
  formula: 'Calories = MET x 3.5 x Weight(kg) / 200 x Minutes | Hatha: 2.5, Vinyasa: 4.0, Power: 5.5, Bikram: 6.5 MET',
  interpretation: '60 min Hatha (gentle): ~120 kcal for 60kg person. Vinyasa: ~200 kcal. Power Yoga: ~270 kcal. Bikram/Hot: ~320 kcal. Yoga builds strength and flexibility alongside calorie burn. Regular practice improves metabolism long-term.'
}

export default calcDef
