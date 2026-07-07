import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Diagonal d1'), numField('b', 'Diagonal d2')],
    defaults: { a: '6', b: '9' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      return { result: 0.5 * a * b, label: 'Area', unit: 'units2', steps: [step('Area:', 'A = 1/2 x ' + a + ' x ' + b + ' = ' + (0.5 * a * b).toFixed(4))] }
    },
    formula: 'A = 1/2 x d1 x d2',
    description: 'Calculate the area of a kite using its diagonals.',
    interpretation: 'The area enclosed by a kite with the given diagonal lengths.'
}

export default calcDef
