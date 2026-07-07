import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base'), numField('b', 'Exponent')],
    defaults: { a: '2', b: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const result = Math.pow(a, b)
      return { result: Math.abs(result) > 1e15 && b > 0 ? 'Very large' : result, label: 'Result', steps: [step('Exponentiation:', '' + a + '^' + b), step('Result:', '' + result)] }
    },
    formula: 'a^b',
    description: 'Calculate a number raised to a power.',
    interpretation: 'The base raised to the power of the exponent.'
}

export default calcDef
