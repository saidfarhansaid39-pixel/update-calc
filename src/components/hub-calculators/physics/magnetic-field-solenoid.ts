import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'length', label: 'Solenoid Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const n = v.turns / v.length; const B = mu0 * n * v.current; return { result: B, label: 'Magnetic Field Inside', unit: 'T', steps: [{ label: 'Formula', value: 'B = μ0nI' }, { label: 'Turns per meter', value: `${n.toFixed(1)} turns/m` }, { label: 'Result', value: `${B.toExponential(4)} T` }] } },
  description: 'The magnetic field inside an ideal solenoid is uniform and depends on current density (turns per meter).',
  formula: 'B = μ0·n·I, n = N/L',
  interpretation: 'The field is nearly uniform inside and much weaker outside. A longer solenoid with more turns produces a stronger field. Ferromagnetic cores can amplify B by factors of 10^3-10^5.'
}

export default calcDef
