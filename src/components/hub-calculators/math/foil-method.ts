import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a in (ax + b)'), numField('b', 'b in (ax + b)'), numField('c', 'c in (cx + d)'), numField('d', 'd in (cx + d)')],
    defaults: { a: '2', b: '3', c: '4', d: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const first = a * c, outer = a * d, inner = b * c, last = b * d
      const x2 = first, x = outer + inner, constVal = last
      let result = ''
      if (x2 !== 0) result += (x2 === 1 ? '' : x2 === -1 ? '-' : x2) + 'x2'
      if (x !== 0) result += (x > 0 && result ? ' + ' : result ? ' - ' : '') + (Math.abs(x) === 1 ? '' : Math.abs(x)) + 'x'
      if (constVal !== 0) result += (constVal > 0 && result ? ' + ' : result ? ' - ' : '') + Math.abs(constVal)
      return { result: result || '0', label: 'Product', steps: [step('First:', '' + a + 'x x ' + c + ' = ' + first + 'x2'), step('Outer:', '' + a + 'x x ' + d + ' = ' + outer + 'x'), step('Inner:', '' + b + ' x ' + c + 'x = ' + inner + 'x'), step('Last:', '' + b + ' x ' + d + ' = ' + constVal), step('Combine:', '' + first + 'x2 + ' + (outer + inner) + 'x + ' + constVal)] }
    },
    formula: '(ax + b)(cx + d) = acx2 + (ad + bc)x + bd',
    description: 'Multiply two binomials using the FOIL method.',
    interpretation: 'The expanded product of the two binomials.'
}

export default calcDef
