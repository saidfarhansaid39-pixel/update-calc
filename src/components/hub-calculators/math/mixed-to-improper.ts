import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Whole Number'), numField('b', 'Numerator'), numField('c', 'Denominator')],
    defaults: { a: '2', b: '1', c: '3' },
    compute: (v) => {
      const whole = Math.round(n(v.a)), num = Math.round(n(v.b)), den = Math.round(n(v.c))
      if (den === 0) return { result: 'Undefined', label: 'Error' }
      const impNum = whole * den + num
      return { result: '' + impNum + '/' + den, label: 'Improper Fraction', steps: [step('Mixed:', whole + ' ' + num + '/' + den), step('Formula:', '(' + whole + ' x ' + den + ' + ' + num + ') / ' + den), step('Result:', '' + impNum + '/' + den)] }
    },
    formula: 'a b/c = (a x c + b)/c',
    description: 'Convert a mixed number to an improper fraction.',
    interpretation: 'The improper fraction representation of the mixed number.'
}

export default calcDef
