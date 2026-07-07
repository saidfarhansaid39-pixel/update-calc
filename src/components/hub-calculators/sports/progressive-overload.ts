import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ previousLoad: z.string().min(1).refine(v => parseFloat(v) > 0), currentLoad: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'previousLoad', label: 'Previous Session Load', type: 'number', unit: 'kg', min: 1, step: '1' },
    { name: 'currentLoad', label: 'Current Session Load', type: 'number', unit: 'kg', min: 1, step: '1' },
  ],
  compute: (v) => {
    const increase = ((v.currentLoad - v.previousLoad) / v.previousLoad) * 100
    return { result: increase, label: 'Load Increase', unit: '%', steps: [
      { label: 'Previous load', value: v.previousLoad.toFixed(0)+' kg' },
      { label: 'Current load', value: v.currentLoad.toFixed(0)+' kg' },
      { label: 'Increase', value: increase.toFixed(1)+'%' },
      { label: 'Progression rate', value: increase > 10 ? 'Aggressive (risk of stalling)' : increase > 5 ? 'Optimal progressive overload' : 'Conservative (safe but slow)' },
    ]}
  }, description: 'Track progressive overload by comparing training loads between sessions. Aim for 2-5% weekly progression.', formula: 'Increase = ((current - previous) / previous) × 100', interpretation: 'Consistent 2-5% weekly load increases drive long-term strength and hypertrophy gains without excessive injury risk.'
}

export default calcDef
