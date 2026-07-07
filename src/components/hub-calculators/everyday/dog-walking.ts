import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dogWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), walkMinPerDay: z.string().min(1).refine(v => parseFloat(v) >= 5, '>=5'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'dogWeight', label: 'Dog Weight (lbs)', type: 'number', min: 1, step: '5' },
    { name: 'walkMinPerDay', label: 'Walk Minutes per Day', type: 'number', min: 5, step: '5' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: '1' },
  ],
  compute: (v) => {
    const weeklyMin = v.walkMinPerDay * v.daysPerWeek
    const weeklyKm = weeklyMin * 0.08
    const calPerMin = v.dogWeight * 0.0008
    const weeklyCal = calPerMin * weeklyMin
    return { result: weeklyMin, label: 'Weekly Walking Duration', unit: 'min', steps: [{ label: 'Daily Duration', value: `${v.walkMinPerDay} min` }, { label: 'Weekly Duration', value: `${weeklyMin} min` }, { label: 'Weekly Distance', value: `${weeklyKm.toFixed(1)} km` }, { label: 'Weekly Calories Burned', value: `${weeklyCal.toFixed(0)} kcal` }] }
  },
  description: 'Calculate your dog walking schedule including weekly duration, distance, and calories burned based on dog weight and walking frequency.',
  formula: 'Weekly Min = Min/Day × Days/Week | Cal = Weight × 0.0008 × Min',
  interpretation: 'Dogs need 30-60 min of exercise daily depending on breed. High-energy breeds (Border Collie, Husky) need more. Small breeds need less. Walking benefits both dog and owner health.'
}

export default calcDef
