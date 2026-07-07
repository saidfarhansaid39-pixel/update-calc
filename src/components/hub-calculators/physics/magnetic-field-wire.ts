import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Radial Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const B = mu0 * v.current / (2 * Math.PI * v.distance); return { result: B, label: 'Magnetic Field', unit: 'T', steps: [{ label: 'Formula', value: 'B = μ0I/(2πr)' }, { label: 'μ0', value: '4π×10^-7 T·m/A' }, { label: 'Result', value: `${B.toExponential(4)} T` }] } },
  description: 'Magnetic field around a long straight current-carrying wire, derived from Ampere\'s Law.',
  formula: 'B = μ0·I / (2π·r)',
  interpretation: 'μ0 = 4π×10^-7 T·m/A. The field encircles the wire with direction given by the right-hand rule. Field strength decreases linearly with distance.'
}

export default calcDef
