import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force1', label: 'Input Force F₁', type: 'number', unit: 'N', min: 0.1, step: '0.1' }, { name: 'area1', label: 'Input Piston Area A₁', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }, { name: 'area2', label: 'Output Piston Area A₂', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  compute: (v) => { const F2 = v.force1 * v.area2 / v.area1; const MA = v.area2 / v.area1; return { result: F2, label: 'Output Force F₂', unit: 'N', steps: [{ label: 'Formula', value: 'F₂ = F₁·A₂/A₁' }, { label: 'Mechanical advantage', value: `${MA.toFixed(2)}×` }, { label: 'Output force', value: `${F2.toFixed(2)} N` }] } },
  description: 'Pascal\'s Principle: pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid. F₁/A₁ = F₂/A₂.',
  formula: 'F₂ = F₁·A₂/A₁',
  interpretation: 'Hydraulic systems multiply force. A small force on a small piston produces a large force on a large piston. Used in car brakes, hydraulic lifts, and construction equipment. The work done is the same (conservation of energy).'
}

export default calcDef
