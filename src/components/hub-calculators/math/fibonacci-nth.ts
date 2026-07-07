import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 100, '0-100 integer') }),
    fields: [numField('n', 'n (0-100)', { min: 0, max: 100, step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let a = 0, b = 1
      for (let i = 0; i < nVal; i++) { const t = a; a = b; b = t + b }
      return { result: a, label: 'F?', steps: [step('n', '' + nVal), step('F?', '' + a)] }
    },
    formula: 'F0 = 0, F1 = 1, F? = F??1 + F??2.',
    description: 'Calculate the nth Fibonacci number.',
    interpretation: 'Each term is the sum of the two preceding terms.'
}

export default calcDef
