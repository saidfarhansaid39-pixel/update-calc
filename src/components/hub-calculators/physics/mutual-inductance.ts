import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns2: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), flux2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns2', label: 'Secondary Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'flux2', label: 'Flux Through Secondary', type: 'number', unit: 'Wb', min: 1e-9, step: '1e-9' }, { name: 'current1', label: 'Primary Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  compute: (v) => { const M = v.turns2 * v.flux2 / v.current1; return { result: M, label: 'Mutual Inductance', unit: 'H', steps: [{ label: 'Formula', value: 'M = N₂Φ₂/I₁' }, { label: 'Result', value: `${M.toExponential(4)} H` }] } },
  description: 'Mutual inductance quantifies the magnetic coupling between two coils. It determines the induced EMF in one coil due to changing current in the other.',
  formula: 'M = N₂·Φ₂ / I₁',
  interpretation: 'Mutual inductance is the basis of transformer operation. The coupling coefficient k = M/√(L₁L₂) ranges from 0 (no coupling) to 1 (perfect coupling).'
}

export default calcDef
