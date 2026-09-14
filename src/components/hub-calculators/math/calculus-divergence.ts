import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'dP/dx'), numField('b', 'dQ/dy')],
    defaults: { a: '2', b: '3' },
    compute: (v) => {
      const dPdx = n(v.a), dQdy = n(v.b)
      const div = dPdx + dQdy
      return { result: div.toFixed(4), label: 'Divergence', steps: [step('Formula:', 'div F = dP/dx + dQ/dy'), step('Result:', '' + div.toFixed(4))] ,
    extras: [
      { label: "Convergence Check", value: "Ensure the method converges for your specific problem parameters." },
      { label: "Error Bound", value: "Numerical methods have inherent approximation error — smaller steps reduce it." },
      { label: "Step Size Impact", value: "Smaller step sizes improve accuracy but increase computation time." },
      { label: "Real Applications", value: "Used in physics, engineering, and economics for dynamic systems." },
      { label: "Numerical vs Analytical", value: "Numerical methods approximate; analytical solutions are exact." }
    ]}
    },
    formula: 'div F = dP/dx + dQ/dy (2D)',
    description: 'Calculate the divergence of a 2D vector field.',
    interpretation: 'The outward flux density of the vector field at the given point.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
