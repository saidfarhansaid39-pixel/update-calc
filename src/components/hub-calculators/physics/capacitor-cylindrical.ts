import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), innerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), outerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'innerR', label: 'Inner Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'outerR', label: 'Outer Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const eps0 = 8.854e-12; const C = 2 * Math.PI * eps0 * v.length / Math.log(v.outerR / v.innerR); return { result: C, label: 'Capacitance', unit: 'F', steps: [{ label: 'Formula', value: 'C = 2πϵ0L/ln(b/a)' }, { label: 'ϵ0', value: '8.854×10^-12 F/m' }, { label: 'Result', value: `${C.toExponential(4)} F` }] } },
  description: 'A cylindrical capacitor consists of two coaxial cylindrical conductors. Capacitance depends on length and radius ratio.',
  formula: 'C = 2πϵ0·L / ln(b/a)',
  interpretation: 'ϵ0 = 8.854×10^-12 F/m. The capacitance increases with length and decreases with larger radius ratio. Coaxial cables are cylindrical capacitors.'
}

export default calcDef
