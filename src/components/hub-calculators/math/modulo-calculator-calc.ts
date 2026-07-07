import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Dividend'), numField('b', 'Divisor')],
    defaults: { a: '17', b: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Division by zero', label: 'Error' }
      const result = ((a % b) + b) % b
      return { result, label: 'a mod b', steps: [step('Formula:', '' + a + ' mod ' + b), step('Result:', '' + result)] }
    },
    formula: 'a mod b = remainder of a/b',
    description: 'Calculate the remainder when dividing two numbers.',
    interpretation: 'The remainder after dividing the dividend by the divisor.'
}

export default calcDef
