import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '12', b: '18' },
    compute: (v) => {
      const a = Math.round(n(v.a)), b = Math.round(n(v.b))
      if (b === 0) return { result: 'Undefined', label: 'Error' }
      const g = gcd(a, b)
      const sNum = a / g, sDen = b / g
      const mixed = sNum >= sDen ? Math.floor(sNum / sDen) : 0
      const rem = sNum % sDen
      const fracStr = mixed > 0 ? (rem === 0 ? '' + mixed : mixed + ' ' + rem + '/' + sDen) : '' + sNum + '/' + sDen
      return { result: fracStr, label: 'Simplified', steps: [step('Original:', '' + a + '/' + b), step('GCD:', '' + g), step('Simplified:', '' + sNum + '/' + sDen)] }
    },
    formula: 'a/b = (a/g)/(b/g) where g = gcd(a,b)',
    description: 'Simplify a fraction to its lowest terms.',
    interpretation: 'The fraction in its simplest form.'
}

export default calcDef
