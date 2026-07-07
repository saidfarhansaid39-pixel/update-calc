import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n', label: 'Number of Moles n', type: 'number', unit: 'mol', min: 0.01, step: '0.01' }, { name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'V1', label: 'Initial Volume V₁', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'V2', label: 'Final Volume V₂', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }],
  compute: (v) => { const R = 8.314; const W = v.n * R * v.T * Math.log(v.V2 / v.V1); return { result: W, label: 'Isothermal Work W', unit: 'J', steps: [{ label: 'Formula', value: 'W = nRT·ln(V₂/V₁)' }, { label: 'Substitute', value: `${v.n} × 8.314 × ${v.T} × ln(${v.V2}/${v.V1})` }, { label: 'Result', value: `${W.toFixed(2)} J` }] } },
  description: 'Work done by an ideal gas during an isothermal (constant temperature) thermodynamic process. For adiabatic, isobaric, or isochoric processes, different formulas apply.',
  formula: 'W = nRT·ln(V₂/V₁) [isothermal]',
  interpretation: 'Positive W means work done by the gas (expansion). For isothermal compression, work is done on the gas (negative). The gas must exchange heat with a reservoir to stay at constant T.'
}

export default calcDef
