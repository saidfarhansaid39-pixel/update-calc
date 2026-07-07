import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), flux: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'flux', label: 'Magnetic Flux', type: 'number', unit: 'Wb', min: 1e-9, step: '1e-9' }, { name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  compute: (v) => { const L = v.turns * v.flux / v.current; return { result: L, label: 'Self-Inductance', unit: 'H', steps: [{ label: 'Formula', value: 'L = NΦ/I' }, { label: 'Result', value: `${L.toExponential(4)} H` }] } },
  description: 'Self-inductance is the property of a coil that opposes changes in current. It stores energy in its magnetic field.',
  formula: 'L = N·Φ / I',
  interpretation: 'Inductance is measured in henries (H). An inductor stores energy as U = ½LI^2. Inductors resist current changes, smoothing current in circuits.'
}

export default calcDef
