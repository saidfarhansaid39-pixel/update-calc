import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Decimal')],
    defaults: { a: '0.75' },
    compute: (v) => {
      const dec = n(v.a)
      const precision = 1000000
      const num = Math.round(dec * precision), den = precision
      const g = gcd(Math.abs(num), den)
      const snum = num / g, sden = den / g
      return { result: snum + '/' + sden, label: 'Fraction', steps: [step('Decimal:', '' + dec), step('Fraction:', snum + '/' + sden)] }
    },
    formula: 'Convert decimal to simplified fraction',
    description: 'Convert a decimal number to a fraction.',
    interpretation: 'The fraction equivalent of the decimal number.'
}

export default calcDef
