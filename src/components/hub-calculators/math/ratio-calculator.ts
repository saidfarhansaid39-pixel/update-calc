import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'First number'), numField('b', 'Second number')],
    defaults: { a: '12', b: '8' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const g = gcd(a, b)
      const sa = a / g, sb = b / g
      return { result: '' + sa + ' : ' + sb, label: 'Simplified Ratio', steps: [step('Original ratio:', '' + a + ' : ' + b), step('GCD:', '' + g), step('Simplified:', '(' + a + '/' + g + ') : (' + b + '/' + g + ') = ' + sa + ' : ' + sb)] }
    },
    formula: 'a : b simplified',
    description: 'Simplify a ratio to its lowest terms.',
    interpretation: 'The ratio in its simplest form.'
}

export default calcDef
