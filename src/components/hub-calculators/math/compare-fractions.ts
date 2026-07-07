import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) !== 0, 'Must be != 0'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) !== 0, 'Must be != 0') }),
    fields: [numField('a', 'Num 1'), numField('b', 'Den 1'), numField('c', 'Num 2'), numField('d', 'Den 2')],
    defaults: { a: '2', b: '3', c: '3', d: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const val1 = a / b, val2 = c / d
      let cmp = ''
      if (val1 < val2) cmp = '<'
      else if (val1 > val2) cmp = '>'
      else cmp = '='
      return { result: '' + a + '/' + b + ' ' + cmp + ' ' + c + '/' + d, label: 'Comparison', steps: [step('Fraction 1:', '' + a + '/' + b + ' = ' + val1.toFixed(4)), step('Fraction 2:', '' + c + '/' + d + ' = ' + val2.toFixed(4)), step('Result:', '' + a + '/' + b + ' ' + cmp + ' ' + c + '/' + d)] }
    },
    formula: 'Cross-multiply: a/b vs c/d -> ad vs bc',
    description: 'Compare two fractions to determine which is larger.',
    interpretation: 'The relational comparison between the two fractions.'
}

export default calcDef
