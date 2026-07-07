import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'd2f/dx2'), numField('b', 'd2f/dy2')],
    defaults: { a: '2', b: '-1' },
    compute: (v) => {
      const d2x = n(v.a), d2y = n(v.b)
      const lap = d2x + d2y
      return { result: lap.toFixed(4), label: 'Laplacian', steps: [step('Formula:', 'del2 f = d2f/dx2 + d2f/dy2'), step('Result:', '' + lap.toFixed(4))] }
    },
    formula: 'del2 f = d2f/dx2 + d2f/dy2',
    description: 'Calculate the Laplacian of a scalar field (2D).',
    interpretation: 'The sum of second partial derivatives of the scalar field.'
}

export default calcDef
