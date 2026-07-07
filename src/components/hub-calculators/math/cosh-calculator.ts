import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Hyperbolic angle (radians)')],
    defaults: { a: '1' },
    compute: (v) => {
      const val = n(v.a); const result = Math.cosh(val)
      return { result: result.toFixed(6), label: 'cosh(x)', steps: [step('Formula', 'cosh(x) = (e^x + e^(-x))/2'), step('Result', result.toFixed(6))] }
    },
    formula: 'cosh(x) = (e^x + e^-x)/2',
    description: 'Calculate the hyperbolic cosine of a value.',
    interpretation: 'Hyperbolic cosine of the given input.'
}

export default calcDef
