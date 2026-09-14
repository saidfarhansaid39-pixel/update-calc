import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x value')],
    defaults: { a: '0.5' },
    compute: (v) => {
      const x = n(v.a)
      const result = 1 + x + x * x / 2
      return { result: result.toFixed(6), label: 'P(x)', steps: [step('Minimax approx:', 'P(x) = 1 + x + x2/2 (degree 2 approximation of ex)'), step('At x=' + x + ':', 'P(' + x + ') = ' + result.toFixed(6)), step('Exact ex:', 'exp(' + x + ') = ' + Math.exp(x).toFixed(6))] ,
    extras: [
      { label: "Convergence Check", value: "Ensure the method converges for your specific problem parameters." },
      { label: "Error Bound", value: "Numerical methods have inherent approximation error — smaller steps reduce it." },
      { label: "Step Size Impact", value: "Smaller step sizes improve accuracy but increase computation time." },
      { label: "Real Applications", value: "Used in physics, engineering, and economics for dynamic systems." },
      { label: "Numerical vs Analytical", value: "Numerical methods approximate; analytical solutions are exact." }
    ]}
    },
    formula: 'Minimax polynomial approximation',
    description: 'Minimax polynomial approximation (degree 2 for ex).',
    interpretation: 'The minimax polynomial approximation minimizing maximum error.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
