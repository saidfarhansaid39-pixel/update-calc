import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120') }),
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
  ],
  compute: (v) => {
    const maxHR = 220 - v.age
    const tanaka = 208 - 0.7 * v.age
    return {
      result: maxHR, label: 'Max Heart Rate (220-age)', unit: 'bpm',
      steps: [
        { label: 'Age', value: `${v.age} years` },
        { label: 'Fox formula (220-age)', value: `${maxHR} bpm` },
        { label: 'Tanaka formula (208-0.7×age)', value: `${tanaka.toFixed(0)} bpm` },
        { label: 'Recommended range', value: `${Math.min(maxHR, tanaka).toFixed(0)}-${Math.max(maxHR, tanaka).toFixed(0)} bpm` },
      ]
}
  },
  description: 'Estimate your maximum heart rate using the Fox formula (220 - age) and Tanaka formula (208 - 0.7 × age). Max HR declines with age.'
}

export default calcDef
