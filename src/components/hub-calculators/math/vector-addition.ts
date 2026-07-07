import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'v1 x'), numField('b', 'v1 y'), numField('c', 'v2 x'), numField('d', 'v2 y')],
    defaults: { a: '1', b: '2', c: '3', d: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      return { result: '(' + (a + c) + ', ' + (b + d) + ')', label: 'v1 + v2', steps: [step('Add components:', '(' + a + '+' + c + ', ' + b + '+' + d + ')'), step('Result:', '(' + (a + c) + ', ' + (b + d) + ')')] }
    },
    formula: 'v1 + v2 = (x1 + x2, y1 + y2)',
    description: 'Add two 2D vectors.',
    interpretation: 'The sum of the two vectors.'
}

export default calcDef
