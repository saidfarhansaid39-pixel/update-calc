import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x', 'Value of x')],
    defaults: { x: '2' },
    compute: (v) => {
      const x = n(v.x); // Evaluate 2x� + 3x� + 4x + 5 using Horner
      const coeffs = [2, 3, 4, 5]; let result = 0; const steps: { label: string; value: string }[] = []
      for (const c of coeffs) { result = result * x + c; steps.push(step('b' + (coeffs.indexOf(c) === 0 ? '3' : coeffs.indexOf(c) === 1 ? '2' : coeffs.indexOf(c) === 2 ? '1' : '0'), '' + result)) }
      return { result: '' + result, label: 'P(x) = 2x�+3x�+4x+5', steps ,
    extras: [
      { label: "Convergence Check", value: "Ensure the method converges for your specific problem parameters." },
      { label: "Error Bound", value: "Numerical methods have inherent approximation error — smaller steps reduce it." },
      { label: "Step Size Impact", value: "Smaller step sizes improve accuracy but increase computation time." },
      { label: "Real Applications", value: "Used in physics, engineering, and economics for dynamic systems." },
      { label: "Numerical vs Analytical", value: "Numerical methods approximate; analytical solutions are exact." }
    ]}
    },
    formula: 'Horner: P(x) = (...((a?x + a??1)x + a??2)x + ...) + a0.',
    description: 'Horner method for efficient polynomial evaluation.',
    interpretation: 'Polynomial value evaluated using nested multiplication.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
