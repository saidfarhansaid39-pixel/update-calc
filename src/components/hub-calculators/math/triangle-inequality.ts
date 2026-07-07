import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Side a'), numField('b', 'Side b'), numField('c', 'Side c')],
    defaults: { a: '3', b: '4', c: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const valid = a + b > c && a + c > b && b + c > a
      return { result: valid ? 'Valid Triangle' : 'Invalid Triangle', label: 'Triangle Inequality', steps: [step('Check 1:', a + ' + ' + b + ' > ' + c + ' -> ' + (a + b > c ? 'OK' : 'FAIL') + ' (' + (a + b) + ' ' + (a + b > c ? '>' : '<=') + ' ' + c + ')'), step('Check 2:', a + ' + ' + c + ' > ' + b + ' -> ' + (a + c > b ? 'OK' : 'FAIL')), step('Check 3:', b + ' + ' + c + ' > ' + a + ' -> ' + (b + c > a ? 'OK' : 'FAIL'))] }
    },
    formula: 'a + b > c, a + c > b, b + c > a',
    description: 'Check if three side lengths can form a valid triangle.',
    interpretation: 'The triangle inequality theorem states the sum of any two sides must exceed the third.'
}

export default calcDef
