import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bodyWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), activeMinutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'bodyWeight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'activeMinutes', label: 'Daily Exercise (minutes)', type: 'number', min: 0, step: '15' },
  ],
  compute: (v) => { const bw = parseFloat(v.bodyWeight)||0; const am = parseFloat(v.activeMinutes)||0; const baseOz = bw * 0.5; const activityOz = (am / 15) * 4; const totalOz = baseOz + activityOz; const totalLiters = totalOz / 33.814; const cups = totalOz / 8; return { result: totalOz, label: 'Daily Water Goal', unit: 'oz', steps: [{ label: 'Base (weight)', value: `${baseOz.toFixed(0)} oz` }, { label: 'Exercise Add', value: `+${activityOz.toFixed(0)} oz` }, { label: 'Total', value: `${totalOz.toFixed(0)} oz (${totalLiters.toFixed(1)} L, ${cups.toFixed(0)} cups)` }] } },
  description: 'Calculate personalized daily water intake based on body weight and exercise duration. Adjust for climate and activity level.',
  formula: 'Water (oz) = Weight(lb) × 0.5 + (Exercise Min ÷ 15) × 4',
  interpretation: 'General guideline: half your body weight in ounces. Add 12 oz per 30 min of exercise. Hot/humid weather increases needs by 20-30%. Drink steadily throughout the day rather than gulping.'
}

export default calcDef
