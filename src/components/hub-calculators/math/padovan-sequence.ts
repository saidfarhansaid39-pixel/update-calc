import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 50, '0-50 integer') }),
    fields: [numField('n', 'n (0-50)', { min: 0, max: 50, step: '1' })],
    defaults: { n: '15' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const P = [1, 1, 1]
      for (let i = 3; i <= nVal; i++) P[i] = P[i - 2] + P[i - 3]
      return { result: P[nVal] || 1, label: 'Padovan(' + nVal + ')', steps: [step('Recurrence', 'P(n) = P(n-2) + P(n-3)'), step('Result', '' + (P[nVal] || 1))] }
    },
    formula: 'P(0) = P(1) = P(2) = 1, P(n) = P(n-2) + P(n-3).',
    description: 'Calculate the nth Padovan number.',
    interpretation: 'Padovan numbers follow a recurrence similar to Perrin but with different initial values.'
}

export default calcDef
