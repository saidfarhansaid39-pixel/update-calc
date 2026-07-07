import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1') }),
    fields: [numField('a', 'Value (x >= 1)')],
    defaults: { a: '2' },
    compute: (v) => {
      const val = n(v.a); const result = Math.acosh(val)
      return { result: result.toFixed(6), label: 'acosh(x)', steps: [step('Formula', 'acosh(x) = ln(x + sqrt(x^2-1))'), step('Result', result.toFixed(6))] }
    },
    formula: 'acosh(x) = ln(x + sqrt(x^2-1))',
    description: 'Calculate the inverse hyperbolic cosine (arcosh) of a value.',
    interpretation: 'The value whose hyperbolic cosine equals the input.'
}

export default calcDef
