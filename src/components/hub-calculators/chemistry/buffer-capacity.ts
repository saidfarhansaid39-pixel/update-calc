import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    acid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    base: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'acid', label: '[Weak Acid]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'base', label: '[Conjugate Base]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const total = v.acid + v.base
    const capacity = Math.min(v.acid, v.base) * 2
    const ratio = v.base / v.acid
    return {
      result: capacity, label: 'Buffer Capacity (β)', unit: 'M',
      steps: [
        { label: '[HA]', value: `${v.acid} M` },
        { label: '[A⁻]', value: `${v.base} M` },
        { label: 'Total buffer concentration', value: `${total.toFixed(3)} M` },
        { label: 'Ratio [A⁻]/[HA]', value: ratio.toFixed(2) },
        { label: 'β ≈ 2 × min([HA], [A⁻])', value: `${capacity.toFixed(3)} M` },
      ]
}
  },
  description: 'Buffer capacity (β) measures the ability of a buffer to resist pH change. It depends on the total concentration of buffer components and their ratio.',
  formula: 'β = 2.303 × ([HA][A⁻]) / ([HA] + [A⁻]) — approximated as 2 × min([HA], [A⁻])',
  interpretation: 'Maximum buffer capacity occurs when [HA] = [A⁻] (ratio = 1). Higher total buffer concentration gives higher capacity. A 0.1 M buffer has 10× the capacity of a 0.01 M buffer.'
}

export default calcDef
