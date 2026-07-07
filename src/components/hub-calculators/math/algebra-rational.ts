import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Numerator a'), numField('b', 'Denominator b'), numField('c', 'Numerator c'), numField('d', 'Denominator d')],
    defaults: { a: '1', b: '2', c: '1', d: '3' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const num = a * d + c * b, den = b * d
      return { result: (num / den).toFixed(4), label: 'Result', steps: [step('Cross multiply:', '(' + a + ' x ' + d + ' + ' + c + ' x ' + b + ') / (' + b + ' x ' + d + ')'), step('Result:', num + '/' + den + ' = ' + (num / den).toFixed(4))] }
    },
    formula: 'a/b + c/d = (ad + bc) / bd',
    description: 'Add two rational expressions.',
    interpretation: 'The sum of the two rational numbers.'
}

export default calcDef
