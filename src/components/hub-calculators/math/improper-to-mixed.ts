import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '7', b: '3' },
    compute: (v) => {
      const a = Math.round(n(v.a)), b = Math.round(n(v.b))
      if (b === 0) return { result: 'Undefined', label: 'Error' }
      const whole = Math.floor(a / b), rem = a % b
      return { result: whole + ' ' + rem + '/' + b, label: 'Mixed Number', steps: [step('Improper fraction:', '' + a + '/' + b), step('Whole:', '' + whole), step('Remainder:', '' + rem), step('Result:', whole + ' ' + rem + '/' + b)] }
    },
    formula: 'a/b = q + r/b where a = qb + r',
    description: 'Convert an improper fraction to a mixed number.',
    interpretation: 'The mixed number representation of the fraction.'
}

export default calcDef
