import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Value (x)'), numField('b', 'Base')],
    defaults: { a: '100', b: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (a <= 0 || b <= 0 || b === 1) return { result: 'Invalid input', label: 'Error' }
      const result = Math.log(a) / Math.log(b)
      return { result, label: 'log_' + b + '(' + a + ')', steps: [step('Formula:', 'log_' + b + '(' + a + ') = ln(' + a + ') / ln(' + b + ')'), step('Result:', '' + result.toFixed(6))] }
    },
    formula: 'log_b(x) = ln(x) / ln(b)',
    description: 'Calculate the logarithm of a value with a specified base.',
    interpretation: 'The exponent to which the base must be raised to get the value.'
}

export default calcDef
