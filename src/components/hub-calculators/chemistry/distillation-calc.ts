import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pa: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    pb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    xa: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n < 1 }, '0-1')
}),
  fields: [
    { name: 'pa', label: 'Vapor Pressure of Pure A', type: 'number', unit: 'mmHg', min: 0.1, step: '0.1' },
    { name: 'pb', label: 'Vapor Pressure of Pure B', type: 'number', unit: 'mmHg', min: 0.1, step: '0.1' },
    { name: 'xa', label: 'Mole Fraction of A in Liquid', type: 'number', unit: '', min: 0.01, max: 0.99, step: '0.01' },
  ],
  compute: (v) => {
    const xb = 1 - v.xa
    const pTotal = v.xa * v.pa + xb * v.pb
    const ya = v.xa * v.pa / pTotal
    const yb = 1 - ya
    return {
      result: pTotal, label: 'Total Vapor Pressure', unit: 'mmHg',
      steps: [
        { label: 'P°A', value: `${v.pa} mmHg` },
        { label: 'P°B', value: `${v.pb} mmHg` },
        { label: 'xA (liquid)', value: `${v.xa.toFixed(3)}` },
        { label: 'xB (liquid)', value: `${xb.toFixed(3)}` },
        { label: 'P_total = xA·P°A + xB·P°B', value: `${pTotal.toFixed(2)} mmHg` },
        { label: 'yA (vapor)', value: `${ya.toFixed(3)}` },
        { label: 'Relative volatility αAB', value: `${(ya / yb / (v.xa / xb)).toFixed(2)}` },
      ]
}
  },
  description: "Distillation calculations use Raoult's Law to determine vapor-liquid equilibrium. The vapor phase is enriched in the more volatile component, enabling separation by boiling.",
  formula: 'P_total = xA·P°A + xB·P°B | yA = xA·P°A / P_total',
  interpretation: 'When the vapor composition (yA) differs sufficiently from the liquid composition (xA), separation by distillation is feasible. A relative volatility α > 1 means separation is possible. Higher α means easier separation with fewer theoretical plates.'
}

export default calcDef
