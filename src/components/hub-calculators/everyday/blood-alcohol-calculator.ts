import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ numDrinks: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), drinkingHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bodyWeight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), bioSex: z.string().min(1) }),
  fields: [
    { name: 'numDrinks', label: 'Number of Drinks', type: 'number', min: 0.5, step: '0.5' },
    { name: 'drinkingHours', label: 'Hours Drinking', type: 'number', min: 0, step: '0.5' },
    { name: 'bodyWeight', label: 'Body Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'bioSex', label: 'Biological Sex', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  compute: (v) => {
    const alcoholOz = v.numDrinks * 0.6
    const r = v.bioSex === 'male' ? 0.68 : 0.55
    const bac = ((alcoholOz * 5.14) / (v.bodyWeight * r)) - (v.drinkingHours * 0.015)
    const safeBac = Math.max(0, bac)
    return { result: safeBac, label: 'Blood Alcohol Content', unit: '%', steps: [{ label: 'Alcohol Consumed', value: `${alcoholOz.toFixed(1)} oz` }, { label: 'BAC Estimate', value: `${safeBac.toFixed(3)}%` }, { label: 'Time to Sober', value: `${(safeBac / 0.015).toFixed(1)} hrs` }] }
  },
  description: 'Estimate your blood alcohol concentration (BAC) using the Widmark formula. Enter drinks consumed, time spent drinking, weight, and sex.',
  formula: 'BAC = ((Drinks×0.6×5.14)/(Weight×r)) - (Hours×0.015), r=0.68(M), 0.55(F)',
  interpretation: 'Legal limit in most US states: 0.08%. At 0.02-0.04%: mild relaxation. At 0.05-0.08%: impaired judgment. At 0.08-0.15%: significant impairment. The body metabolizes ~0.015% BAC per hour.'
}

export default calcDef
