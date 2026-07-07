import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'area', label: 'Cross-Sectional Area', type: 'number', unit: 'm^2', min: 1e-6, step: '1e-6' }, { name: 'length', label: 'Solenoid Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const L = mu0 * v.turns * v.turns * v.area / v.length; return { result: L, label: 'Inductance', unit: 'H', steps: [{ label: 'Formula', value: 'L = u0N^2A/l' }, { label: 'u0', value: '4pi×10⁻⁷ H/m' }, { label: 'Result', value: `${L.toExponential(4)} H` }] } },
  description: 'Inductance of a solenoid depends on the number of turns, cross-sectional area, and length.',
  formula: 'L = u0·N^2·A / l',
  interpretation: 'Inductance is measured in henries (H). Inductors oppose changes in current. 1 H = 1 V·s/A.'
}

export default calcDef
