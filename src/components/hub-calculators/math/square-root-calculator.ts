import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0') }),
    fields: [numField('a', 'Number')],
    defaults: { a: '144' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.sqrt(a), label: 'sqrt(x)', steps: [step('Formula:', 'sqrt(' + a + ')'), step('Result:', '' + Math.sqrt(a).toFixed(6))] }
    },
    formula: 'sqrt(x)',
    description: 'Calculate the square root of a non-negative number.',
    interpretation: 'The number that when multiplied by itself equals the input.'
}

export default calcDef
