import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Math.abs(parseFloat(v)) < 1, 'Must be |x| < 1') }),
    fields: [numField('a', 'Value (|x| < 1)')],
    defaults: { a: '0.5' },
    compute: (v) => {
      const val = n(v.a); const result = Math.atanh(val)
      return { result: result.toFixed(6), label: 'atanh(x)', steps: [step('Formula', 'atanh(x) = 1/2 � ln((1+x)/(1-x))'), step('Result', result.toFixed(6))] }
    },
    formula: 'atanh(x) = 1/2 � ln((1+x)/(1-x))',
    description: 'Calculate the inverse hyperbolic tangent (artanh) of a value.',
    interpretation: 'The value whose hyperbolic tangent equals the input.'
}

export default calcDef
