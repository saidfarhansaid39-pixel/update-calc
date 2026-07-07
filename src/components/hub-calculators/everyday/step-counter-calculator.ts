import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), strideLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), strideUnit: z.string().min(1) }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'strideLength', label: 'Stride Length', type: 'number', min: 0.5, step: '0.1' },
    { name: 'strideUnit', label: 'Stride Unit', type: 'select', options: [{ label: 'Feet', value: 'ft' }, { label: 'Meters', value: 'm' }] },
  ],
  compute: (v) => {
    const strideFt = v.strideUnit === 'm' ? v.strideLength * 3.28084 : v.strideLength
    const distanceFt = v.steps * strideFt
    const miles = distanceFt / 5280
    const km = distanceFt / 3280.84
    const calories = v.steps * 0.04
    return { result: miles, label: 'Distance Walked', unit: 'mi', steps: [{ label: 'Total Steps', value: `${v.steps}` }, { label: 'Distance (mi)', value: `${miles.toFixed(2)} mi` }, { label: 'Distance (km)', value: `${km.toFixed(2)} km` }, { label: 'Estimated Calories', value: `${calories.toFixed(0)} kcal` }] }
  },
  description: 'Convert steps to distance in miles and kilometers using your stride length. Also estimates calories burned.',
  formula: 'Distance(mi) = Steps × Stride(ft) / 5280 | Distance(km) = Steps × Stride(m) / 1000',
  interpretation: 'Average stride: height×0.415 for men, height×0.413 for women. 10,000 steps ≈ 5 mi (8 km) for average person. 2,000 steps ≈ 1 mi. Sedentary: 3,000-5,000 steps/day. Active: 10,000+. Highly active: 12,500+.'
}

export default calcDef
