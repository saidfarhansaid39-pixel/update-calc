import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Decimal')],
    defaults: { a: '0.75' },
    compute: (v) => {
      const a = n(v.a)
      let num = a, den = 1
      while (Math.abs(num - Math.round(num)) > 1e-10) { num *= 10; den *= 10 }
      const g = gcd(Math.round(num), den)
      const nNum = Math.round(num) / g, nDen = den / g
      const mixed = nNum >= nDen ? Math.floor(nNum / nDen) : 0
      const rem = nNum % nDen
      const fracStr = mixed > 0 ? (rem === 0 ? '' + mixed : mixed + ' ' + rem + '/' + nDen) : (rem === 0 ? '0' : '' + Math.round(rem) + '/' + nDen)
      return { result: fracStr, label: 'Fraction', steps: [step('Decimal:', '' + a), step('Fraction:', fracStr)] }
    },
    formula: 'Convert decimal to fraction',
    description: 'Convert a decimal number to a fraction.',
    interpretation: 'The fractional equivalent of the decimal value.'
}

export default calcDef
