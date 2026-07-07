import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Value (x)')],
    defaults: { a: '1' },
    compute: (v) => {
      const val = n(v.a); const result = Math.asinh(val)
      return { result: result.toFixed(6), label: 'asinh(x)', steps: [step('Formula', 'asinh(x) = ln(x + sqrt(x^2+1))'), step('Result', result.toFixed(6))] }
    },
    formula: 'asinh(x) = ln(x + sqrt(x^2+1))',
    description: 'Calculate the inverse hyperbolic sine (arsinh) of a value.',
    interpretation: 'The value whose hyperbolic sine equals the input.'
}

export default calcDef
