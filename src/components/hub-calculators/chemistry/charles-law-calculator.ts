import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    v1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'v1', label: 'Initial Volume V₁', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 't1', label: 'Initial Temperature T₁', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 't2', label: 'Final Temperature T₂', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const v2 = v.v1 * v.t2 / v.t1
    return {
      result: v2, label: 'Final Volume V₂', unit: 'L',
      steps: [
        { label: 'V₁', value: `${v.v1} L` },
        { label: 'T₁', value: `${v.t1} K` },
        { label: 'T₂', value: `${v.t2} K` },
        { label: 'V₂ = V₁ × T₂/T₁', value: `${v2.toFixed(4)} L` },
        { label: 'Relationship', value: v.t2 > v.t1 ? 'Temperature increases, volume increases' : 'Temperature decreases, volume decreases' },
      ]
}
  },
  description: 'Charles\'s Law states that for a fixed amount of gas at constant pressure, volume is directly proportional to absolute temperature.',
  formula: 'V₁/T₁ = V₂/T₂',
  interpretation: 'When temperature doubles (in Kelvin), volume doubles. This is why hot air balloons rise — the hot air expands, becoming less dense than surrounding air.'
}

export default calcDef
