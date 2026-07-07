import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Number')],
    defaults: { a: '27' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.cbrt(a), label: 'cbrt(x)', steps: [step('Formula:', 'cbrt(' + a + ')'), step('Result:', '' + Math.cbrt(a).toFixed(6))] }
    },
    formula: 'cbrt(x)',
    description: 'Calculate the cube root of a number.',
    interpretation: 'The number that when cubed equals the input.'
}

export default calcDef
