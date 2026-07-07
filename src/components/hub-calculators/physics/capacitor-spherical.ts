import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ innerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), outerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'innerR', label: 'Inner Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'outerR', label: 'Outer Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const eps0 = 8.854e-12; const C = 4 * Math.PI * eps0 * v.innerR * v.outerR / (v.outerR - v.innerR); return { result: C, label: 'Capacitance', unit: 'F', steps: [{ label: 'Formula', value: 'C = 4πϵ0·ab/(b-a)' }, { label: 'ϵ0', value: '8.854×10^-12 F/m' }, { label: 'Result', value: `${C.toExponential(4)} F` }] } },
  description: 'A spherical capacitor consists of two concentric spherical shells. The electric field is radial and confined between the shells.',
  formula: 'C = 4πϵ0·a·b/(b-a)',
  interpretation: 'a is the inner radius, b is the outer radius. As the shells get closer (b-a decreases), capacitance increases. For an isolated sphere, C = 4πϵ0R.'
}

export default calcDef
