import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 6, '0-6 integer') }),
    fields: [numField('n', 'n (0-6)', { min: 0, max: 6, step: '1' })],
    defaults: { n: '4' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let result = 1
      for (let i = 1; i <= nVal; i++) result *= fact(i)
      return { result, label: 'sf(n)', steps: [step('n', '' + nVal), step('sf(n) = 1! x 2! x ... x n!', '' + result)] }
    },
    formula: 'sf(n) = 1! x 2! x ... x n!.',
    description: 'Calculate the superfactorial (product of factorials).',
    interpretation: 'The product of the first n factorials.'
}

export default calcDef
