import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), weight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), stride: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'steps', label: 'Daily Steps', type: 'number', min: 0, step: '100' },
    { name: 'weight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'stride', label: 'Stride Length (in)', type: 'number', min: 12, step: '1' },
  ],
  compute: (v) => { const s = parseFloat(v.steps)||0; const w = parseFloat(v.weight)||0; const st = parseFloat(v.stride)||0; const distMi = (s * st) / 63360; const calPerLbPerMi = 0.57; const cal = distMi * w * calPerLbPerMi; return { result: cal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Distance', value: `${distMi.toFixed(2)} mi` }, { label: 'Calories Burned', value: `${cal.toFixed(0)} kcal` }] } },
  description: 'Estimate calories burned from walking based on step count, body weight, and stride length. Uses standard walking MET values.',
  formula: 'Calories = (Steps × Stride) ÷ 63360 × Weight × 0.57',
  interpretation: 'A 160 lb person burns ~100 kcal per mile walking. Step trackers often overestimate; this gives a science-based estimate. Increase stride for higher intensity.'
}

export default calcDef
