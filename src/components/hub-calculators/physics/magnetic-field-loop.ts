import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }, { name: 'radius', label: 'Loop Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const mu0 = 4 * Math.PI * 1e-7; const B = mu0 * v.current / (2 * v.radius); return { result: B, label: 'Magnetic Field at Center', unit: 'T', steps: [{ label: 'Formula', value: 'B = μ0I/(2R)' }, { label: 'μ0', value: '4π×10^-7 T·m/A' }, { label: 'Result', value: `${B.toExponential(4)} T` }] } },
  description: 'Magnetic field at the center of a single current-carrying circular loop of wire.',
  formula: 'B = μ0·I / (2R)',
  interpretation: 'The field direction is perpendicular to the plane of the loop (right-hand rule). Field strength is inversely proportional to loop radius. Multiple loops (N) multiply the field by N.'
}

export default calcDef
