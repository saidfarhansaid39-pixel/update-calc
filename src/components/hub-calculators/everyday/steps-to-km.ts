import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), heightCm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'heightCm', label: 'Your Height (cm)', type: 'number', min: 100, max: 250, step: '1' },
  ],
  compute: (v) => {
    const strideM = v.heightCm * 0.415 / 100
    const distanceKm = v.steps * strideM / 1000
    const calories = v.steps * 0.04
    return { result: distanceKm, label: 'Distance', unit: 'km', steps: [{ label: 'Steps', value: `${v.steps}` }, { label: 'Stride Length', value: `${(strideM * 100).toFixed(1)} cm` }, { label: 'Distance', value: `${distanceKm.toFixed(2)} km` }, { label: 'Calories Burned', value: `~${calories.toFixed(0)} kcal` }] }
  },
  description: 'Convert steps to kilometers based on your height. Uses stride length estimated as 41.5% of height for accurate distance.',
  formula: 'Stride(cm) = Height × 0.415 | Distance(km) = Steps × Stride(m) / 1000',
  interpretation: '10,000 steps ≈ 7-8 km for average person. Daily target: 10,000 steps (5 mi/8 km). Walking 30 min/day at brisk pace adds ~4,000 steps. Great low-impact exercise for weight management and cardiovascular health.'
}

export default calcDef
