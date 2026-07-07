import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), separation: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dielectric: z.string().min(1).refine(v => parseFloat(v) >= 1, '>0') }),
  fields: [{ name: 'area', label: 'Plate Area', type: 'number', unit: 'm^2', min: 1e-6, step: '1e-6' }, { name: 'separation', label: 'Plate Separation', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'dielectric', label: 'Dielectric Constant', type: 'number', unit: '', min: 1, step: '0.1' }],
  compute: (v) => { const eps0 = 8.854e-12; const C = v.dielectric * eps0 * v.area / v.separation; return { result: C, label: 'Capacitance', unit: 'F', steps: [{ label: 'Formula', value: 'C = κeps0A/d' }, { label: 'eps0', value: '8.854×10⁻¹^2 F/m' }, { label: 'Result', value: `${C.toExponential(4)} F` }] } },
  description: 'Capacitance of a parallel-plate capacitor depends on plate area, separation, and the dielectric material between them.',
  formula: 'C = κ·eps0·A / d',
  interpretation: 'eps0 = 8.854×10⁻¹^2 F/m. Dielectric constant κ = 1 for vacuum, ~80 for water. Capacitors store electrical energy as U = ½CV^2.'
}

export default calcDef
