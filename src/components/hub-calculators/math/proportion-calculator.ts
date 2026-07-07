import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'a (a/b = c/d)'), numField('b', 'b (a/b = c/d)'), numField('c', 'c (a/b = c/d)')],
    defaults: { a: '2', b: '4', c: '6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      if (b === 0) return { result: 'Division by zero', label: 'Error' }
      const d = (b * c) / a
      return { result: d.toFixed(4), label: 'Unknown (d)', steps: [step('Proportion:', '' + a + '/' + b + ' = ' + c + '/d'), step('Cross-multiply:', '' + a + ' x d = ' + b + ' x ' + c), step('d:', '(' + b + ' x ' + c + ') / ' + a + ' = ' + d.toFixed(4))] }
    },
    formula: 'a/b = c/d  ->  d = bc/a',
    description: 'Solve a proportion a/b = c/d for the unknown value d.',
    interpretation: 'The value of d that makes the proportion true.'
}

export default calcDef
