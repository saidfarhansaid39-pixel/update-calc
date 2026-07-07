import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 50, '0-50 integer') }),
    fields: [numField('n', 'n (0-50)', { min: 0, max: 50, step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let a = 0, b = 0, c = 1
      for (let i = 0; i < nVal; i++) { const t = a + b + c; a = b; b = c; c = t }
      return { result: a, label: 'T?', steps: [step('n', '' + nVal), step('T?', '' + a)] }
    },
    formula: 'T0 = 0, T1 = 0, T2 = 1, T? = T??1 + T??2 + T??3.',
    description: 'Calculate the nth Tribonacci number.',
    interpretation: 'Each term is the sum of the three preceding terms.'
}

export default calcDef
