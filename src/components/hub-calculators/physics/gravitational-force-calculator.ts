import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass1', label: 'Mass 1', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'mass2', label: 'Mass 2', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'dist', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const G = 6.674e-11; const f = G * v.mass1 * v.mass2 / (v.dist * v.dist); return { result: f, label: 'Gravitational Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = Gm1m2/r^2' }, { label: 'Substitute', value: `${G.toExponential()} × ${v.mass1} × ${v.mass2} / ${v.dist}^2` }, { label: 'Result', value: `${f.toExponential(4)} N` }] } },
  description: 'Newton\'s Law of Universal Gravitation: every mass attracts every other mass with a force proportional to the product of masses and inversely proportional to the square of distance.',
  formula: 'F = G·m1·m2 / r^2',
  interpretation: 'G = 6.674×10⁻¹¹ N·m^2/kg^2. The gravitational force is extremely weak but dominates at astronomical scales.'
}

export default calcDef
