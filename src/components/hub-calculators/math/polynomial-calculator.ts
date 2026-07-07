import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a (x2)'), numField('b', 'Coefficient b (x)'), numField('c', 'Constant c'), numField('x', 'Value of x')],
    defaults: { a: '2', b: '3', c: '1', x: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), x = n(v.x)
      const result = a * x * x + b * x + c
      return { result, label: 'P(' + x + ')', steps: [step('Polynomial:', 'P(x) = ' + a + 'x2 + ' + b + 'x + ' + c), step('Substitute x = ' + x, 'P(' + x + ') = ' + a + 'x' + x + '2 + ' + b + 'x' + x + ' + ' + c), step('Result:', 'P(' + x + ') = ' + result)] }
    },
    formula: 'P(x) = ax2 + bx + c',
    description: 'Evaluate a polynomial P(x) = ax2 + bx + c at a given value of x.',
    interpretation: 'The value of the polynomial when x equals the given value.'
}

export default calcDef
