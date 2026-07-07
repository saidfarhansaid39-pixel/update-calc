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
    { name: 'conc', label: 'Reactant Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'order', label: 'Reaction Order', type: 'number', unit: '', min: 0, max: 3, step: '1' },
  ],
  compute: (v) => {
    const rate = v.k * Math.pow(v.conc, v.order)
    const units = v.order === 0 ? 'M/s' : v.order === 1 ? 's⁻¹' : v.order === 2 ? 'M⁻¹·s⁻¹' : 'M⁻²·s⁻¹'
    return {
      result: rate, label: 'Reaction Rate', unit: units,
      steps: [
        { label: 'k', value: `${v.k.toExponential(4)}` },
        { label: '[A]', value: `${v.conc} M` },
        { label: 'Order', value: `${v.order}` },
        { label: 'Rate = k[A]^n', value: `${rate.toExponential(4)} ${units}` },
        { label: 'Half-life (if 1st order)', value: v.order === 1 ? `${(Math.LN2 / v.k).toExponential(4)} s` : '—' },
      ]
}
  },
  description: 'The rate law expresses the reaction rate as a function of reactant concentrations, each raised to a power (the reaction order) determined experimentally.',
  formula: 'Rate = k[A]ⁿ',
  interpretation: 'Zero-order: constant rate. First-order: rate ∝ [A]. Second-order: rate ∝ [A]². The order must be determined experimentally, not from the balanced equation.'
}

export default calcDef
