import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dist1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    timeMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dist2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'dist1', label: 'Known Race Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
    { name: 'timeMin', label: 'Known Race Time', type: 'number', unit: 'min', min: 1, step: '0.1' },
    { name: 'dist2', label: 'Target Race Distance', type: 'number', unit: 'km', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const predMin = v.timeMin * Math.pow(v.dist2 / v.dist1, 1.06)
    const hours = Math.floor(predMin / 60)
    const mins = Math.round(predMin % 60)
    return {
      result: predMin, label: 'Predicted Finish Time', unit: 'min',
      steps: [
        { label: 'Known distance', value: `${v.dist1} km in ${v.timeMin} min` },
        { label: 'Target distance', value: `${v.dist2} km` },
        { label: 'Riegel formula', value: `${v.timeMin} × (${v.dist2}/${v.dist1})^1.06 = ${predMin.toFixed(1)} min` },
        { label: 'Predicted finish', value: `${hours}h ${mins}m (${predMin.toFixed(1)} min)` },
      ]
}
  },
  description: 'Predict race time for one distance from a known time at another distance using the Riegel formula. The exponent 1.06 accounts for the nonlinear relationship between distance and performance.'
}

export default calcDef
