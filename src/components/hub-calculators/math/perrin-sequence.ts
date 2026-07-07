import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 50, '0-50 integer') }),
    fields: [numField('n', 'n (0-50)', { min: 0, max: 50, step: '1' })],
    defaults: { n: '15' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const P = [3, 0, 2]
      for (let i = 3; i <= nVal; i++) P[i] = P[i - 2] + P[i - 3]
      return { result: P[nVal], label: 'Perrin(' + nVal + ')', steps: [step('Recurrence', 'P(n) = P(n-2) + P(n-3)'), step('Result', '' + P[nVal])] }
    },
    formula: 'P(0) = 3, P(1) = 0, P(2) = 2, P(n) = P(n-2) + P(n-3).',
    description: 'Calculate the nth Perrin number.',
    interpretation: 'Perrin numbers have the property that n divides P(n) if n is prime.'
}

export default calcDef
