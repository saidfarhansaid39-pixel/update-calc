import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ drinks: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), gender: z.string().min(1, 'Required') }),
  fields: [
    { name: 'drinks', label: 'Number of Drinks', type: 'number', min: 0, step: '0.5' },
    { name: 'hours', label: 'Hours Spent Drinking', type: 'number', min: 0, step: '0.5' },
    { name: 'weight', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  compute: (v) => {
    const totalAlcohol = v.drinks * 0.6
    const distribRatio = v.gender === 'male' ? 0.68 : 0.55
    const bac = ((totalAlcohol * 5.14) / (v.weight * distribRatio)) - (v.hours * 0.015)
    const safeBac = Math.max(0, bac)
    return { result: safeBac, label: 'Estimated BAC', unit: '%', steps: [{ label: 'Total Alcohol', value: `${totalAlcohol.toFixed(1)} oz` }, { label: 'Widmark Factor', value: distribRatio.toFixed(2) }, { label: 'Estimated BAC', value: `${safeBac.toFixed(3)}%` }] }
  },
  description: 'Estimate blood alcohol concentration (BAC) based on number of drinks, time, weight, and gender using the Widmark formula.',
  formula: 'BAC = ((Drinks × 0.6 × 5.14) / (Weight × r)) - (Hours × 0.015), where r = 0.68 (male) or 0.55 (female)',
  interpretation: 'BAC above 0.08% is legally impaired in most US states. Even at 0.02-0.04% you may experience reduced coordination. Always designate a sober driver.'
}

export default calcDef
