import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    order: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 3 }, '0-3')
}),
  fields: [
    { name: 'k', label: 'Rate Constant k', type: 'number', unit: 'M^(1-n)/s', min: 0.0001, step: 'any' },
    { name: 'conc', label: 'Reactant Concentration [A]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'order', label: 'Reaction Order n', type: 'number', unit: '', min: 0, max: 3, step: '1' },
  ],
  compute: (v) => {
    const rate = v.k * Math.pow(v.conc, v.order)
    const halfLife = v.order === 1 ? Math.LN2 / v.k : v.order === 0 ? v.conc / (2 * v.k) : v.order === 2 ? 1 / (v.k * v.conc) : null
    return {
      result: rate, label: 'Reaction Rate', unit: 'M/s',
      steps: [
        { label: 'k', value: `${v.k.toExponential(4)}` },
        { label: '[A]', value: `${v.conc} M` },
        { label: 'Order n', value: `${v.order}` },
        { label: 'Rate = k[A]ⁿ', value: `${rate.toExponential(4)} M/s` },
        { label: 'Half-life', value: halfLife !== null ? `${halfLife.toExponential(4)} s` : '—' },
      ]
}
  },
  description: 'The rate law expresses reaction rate as Rate = k[A]ⁿ, where k is the rate constant, [A] is concentration, and n is the reaction order determined experimentally.',
  formula: 'Rate = k[A]ⁿ',
  interpretation: 'Zero-order: constant rate. First-order: rate ∝ [A]. Second-order: rate ∝ [A]². The order must be found experimentally, not from the balanced equation coefficients.'
}

export default calcDef
