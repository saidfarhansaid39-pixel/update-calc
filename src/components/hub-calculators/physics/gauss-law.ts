import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Enclosed Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }],
  defaults: { charge: '1' },
  presets: [
    { label: 'Standard example 1', values: { charge: '1' } },
    { label: 'Standard example 2', values: { charge: '10' } },
    { label: 'Standard example 3', values: { charge: '100' } },
  ],
  compute: (v) => { const eps0 = 8.854e-12; const flux = v.charge / eps0; return { result: flux, label: 'Electric Flux', unit: 'N·m^2/C', steps: [{ label: 'Formula', value: 'Φ_E = Q/eps0' }, { label: 'eps0', value: '8.854×10⁻¹^2 C^2/N·m^2' }, { label: 'Result', value: `${flux.toExponential(4)} N·m^2/C` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Gauss\'s Law states the total electric flux through a closed surface equals the enclosed charge divided by the permittivity of free space.',
  formula: 'Φ_E = ∮E·dA = Q/eps0',
  interpretation: 'Gauss\'s Law is one of Maxwell\'s equations. It simplifies electric field calculations for symmetric charge distributions like spheres, cylinders, and planes.'
}

export default calcDef
