import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (x� coeff)'), numField('b', 'b (x coeff)'), numField('c', 'c (const)'), numField('d', 'd (x� coeff of 2nd)')],
    defaults: { a: '1', b: '2', c: '1', d: '1' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d); const res = a * d - b * c
      return { result: res, label: 'Resultant', steps: [step('Resultant', '' + res)] }
    },
    formula: 'Resultant of ax�+bx+c and dx�+ex+f.',
    description: 'Calculate the resultant of two quadratic polynomials (simplified).',
    interpretation: 'Resultant = 0 when polynomials share a root.'
}

export default calcDef
