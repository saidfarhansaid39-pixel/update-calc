import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Hyperbolic angle (radians)')],
    defaults: { a: '1' },
    compute: (v) => {
      const val = n(v.a); const result = Math.tanh(val)
      return { result: result.toFixed(6), label: 'tanh(x)', steps: [step('Formula', 'tanh(x) = sinh(x)/cosh(x)'), step('Result', result.toFixed(6))] }
    },
    formula: 'tanh(x) = sinh(x)/cosh(x)',
    description: 'Calculate the hyperbolic tangent of a value.',
    interpretation: 'Hyperbolic tangent of the given input.'
}

export default calcDef
