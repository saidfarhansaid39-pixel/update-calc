import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'v1 x'), numField('b', 'v1 y'), numField('c', 'v2 x'), numField('d', 'v2 y')],
    defaults: { a: '3', b: '1', c: '2', d: '-2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const dot = a * c + b * d
      const cross = a * d - b * c
      return { result: 'dot=' + dot + ', cross=' + cross, label: 'Vector ops', steps: [step('Dot product:', '' + a + 'x' + c + ' + ' + b + 'x' + d + ' = ' + dot), step('Cross product (2D):', '' + a + 'x' + d + ' - ' + b + 'x' + c + ' = ' + cross)] }
    },
    formula: 'Dot: v1.v2, Cross: v1 x v2 (2D scalar)',
    description: 'Calculate dot and cross products of 2D vectors.',
    interpretation: 'The dot product and 2D cross product of the vectors.'
}

export default calcDef
