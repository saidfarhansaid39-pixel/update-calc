import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Value')],
    defaults: { a: '12345.67' },
    compute: (v) => {
      const a = n(v.a)
      if (a === 0) return { result: '0 x 10^0', label: 'Scientific Notation', steps: [step('Value is 0', '0')] }
      const exp = Math.floor(Math.log10(Math.abs(a)))
      const coef = a / Math.pow(10, exp)
      return { result: '' + coef.toFixed(6) + ' x 10^' + exp, label: 'Scientific Notation', steps: [step('Value:', '' + a), step('Exponent:', '' + exp), step('Coefficient:', '' + coef.toFixed(6)), step('Result:', '' + coef.toFixed(6) + ' x 10^' + exp)] }
    },
    formula: 'a = m x 10^e where 1 <= |m| < 10',
    description: 'Convert a number to scientific notation.',
    interpretation: 'The number expressed in scientific notation.'
}

export default calcDef
