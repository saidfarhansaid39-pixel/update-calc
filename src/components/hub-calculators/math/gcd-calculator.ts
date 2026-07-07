import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Number a'), numField('b', 'Number b')],
    defaults: { a: '48', b: '18' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const result = gcd(a, b)
      return { result, label: 'GCD(' + a + ', ' + b + ')', steps: [step('Euclidean:', 'gcd(' + a + ', ' + b + ')'), step('Result:', '' + result)] }
    },
    formula: 'gcd(a, b) via Euclidean algorithm',
    description: 'Calculate the greatest common divisor of two numbers.',
    interpretation: 'The largest positive integer that divides both numbers.'
}

export default calcDef
