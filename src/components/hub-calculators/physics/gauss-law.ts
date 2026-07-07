import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Enclosed Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }],
  compute: (v) => { const eps0 = 8.854e-12; const flux = v.charge / eps0; return { result: flux, label: 'Electric Flux', unit: 'N·m^2/C', steps: [{ label: 'Formula', value: 'Φ_E = Q/eps0' }, { label: 'eps0', value: '8.854×10⁻¹^2 C^2/N·m^2' }, { label: 'Result', value: `${flux.toExponential(4)} N·m^2/C` }] } },
  description: 'Gauss\'s Law states the total electric flux through a closed surface equals the enclosed charge divided by the permittivity of free space.',
  formula: 'Φ_E = ∮E·dA = Q/eps0',
  interpretation: 'Gauss\'s Law is one of Maxwell\'s equations. It simplifies electric field calculations for symmetric charge distributions like spheres, cylinders, and planes.'
}

export default calcDef
