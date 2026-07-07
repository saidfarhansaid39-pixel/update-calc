import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Lower bound'), numField('b', 'Upper bound')],
    defaults: { a: '0', b: '10' },
    compute: (v) => {
      const lo = n(v.a), hi = n(v.b)
      return { result: '[' + lo + ', ' + hi + ']', label: 'Interval Notation', steps: [step('Inequality:', '' + lo + ' <= x <= ' + hi), step('Interval:', '[' + lo + ', ' + hi + ']')] }
    },
    formula: 'Interval [a, b]',
    description: 'Convert between inequality and interval notation.',
    interpretation: 'The set of x values satisfying the inequality.'
}

export default calcDef
