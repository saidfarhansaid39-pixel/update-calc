import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 50, '0-50 integer') }),
    fields: [numField('n', 'n (0-50)', { min: 0, max: 50, step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let a = 2, b = 1
      for (let i = 1; i < nVal; i++) { const t = a; a = b; b = t + b }
      return { result: nVal === 0 ? 2 : a, label: 'L?', steps: [step('n', '' + nVal), step('L?', '' + (nVal === 0 ? 2 : a))] }
    },
    formula: 'L0 = 2, L1 = 1, L? = L??1 + L??2.',
    description: 'Calculate the nth Lucas number.',
    interpretation: 'Lucas numbers follow the same recurrence as Fibonacci with different starting values.'
}

export default calcDef
