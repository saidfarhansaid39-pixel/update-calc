import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Value x')],
    defaults: { a: '-5' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.abs(a), label: '|x|', steps: [step('Input:', 'x = ' + a), step('Result:', '|' + a + '| = ' + Math.abs(a))] }
    },
    formula: '|x| = x if x >= 0, -x if x < 0',
    description: 'Calculate the absolute value of a number.',
    interpretation: 'The distance of the number from zero on the number line.'
}

export default calcDef
