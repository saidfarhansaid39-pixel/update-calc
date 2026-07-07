import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) !== 0, 'Must be != 0') }),
    fields: [numField('a', 'Dividend'), numField('b', 'Divisor (?0)')],
    defaults: { a: '10', b: '3' },
    compute: (v) => {
      const val = n(v.a), divisor = n(v.b); const q = Math.floor(val / divisor), r = val - q * divisor
      return { result: `${q} R ${r}`, label: 'Quotient & Remainder', steps: [step('Quotient', '' + q), step('Remainder', '' + r)] }
    },
    formula: 'Dividend = Divisor � Quotient + Remainder.',
    description: 'Divide a polynomial (simplified integer division with remainder).',
    interpretation: 'Quotient and remainder from polynomial division.'
}

export default calcDef
