import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= -1 && Number(v) <= 300, '-1 to 300 integer') }),
    fields: [numField('n', 'n (-1 to 300)', { step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let result = 1
      for (let i = nVal; i > 0; i -= 2) result *= i
      if (nVal === -1) result = 1; if (nVal === 0) result = 1
      return { result, label: 'n!!', steps: [step('n', '' + nVal), step('Double factorial', '' + result)] }
    },
    formula: 'n!! = n x (n-2) x ... x 1 (odd n) or 2 (even n).',
    description: 'Calculate the double factorial n!!.',
    interpretation: 'Product of every other integer from n down to 1 or 2.'
}

export default calcDef
