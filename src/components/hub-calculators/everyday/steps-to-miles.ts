import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightInches: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'heightInches', label: 'Your Height (in)', type: 'number', min: 36, max: 96, step: '1' },
  ],
  compute: (v) => {
    const strideFt = v.heightInches * 0.415 / 12
    const miles = v.steps * strideFt / 5280
    const km = miles * 1.60934
    return { result: miles, label: 'Distance', unit: 'mi', steps: [{ label: 'Steps', value: `${v.steps}` }, { label: 'Stride', value: `${(strideFt * 12).toFixed(1)} in` }, { label: 'Distance (mi)', value: `${miles.toFixed(2)} mi` }, { label: 'Distance (km)', value: `${km.toFixed(2)} km` }] }
  },
  description: 'Convert steps to miles based on your height. Calculates stride length as 41.5% of height for accurate distance measurement.',
  formula: 'Stride(ft) = Height(in) × 0.415 / 12 | Miles = Steps × Stride / 5280',
  interpretation: '2,000 steps ≈ 1 mile for average person. 10,000 steps ≈ 5 miles. Walking 10,000 steps/day burns ~300-500 extra calories. One mile of walking burns ~80-100 calories for a 150-lb person.'
}

export default calcDef
