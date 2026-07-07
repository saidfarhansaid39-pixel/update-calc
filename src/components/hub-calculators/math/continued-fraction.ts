import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 && Number(v) <= 1000, 'Number > 0') }),
    fields: [numField('n', 'Number (positive)', { min: 0.01, max: 1000 })],
    defaults: { n: '3.14159' },
    compute: (v) => {
      let x = n(v.n); const terms: number[] = []
      for (let i = 0; i < 10 && x > 0; i++) { const a = Math.floor(x); terms.push(a); const rem = x - a; if (rem < 1e-10) break; x = 1 / rem }
      return { result: terms.join(', '), label: 'Continued fraction', steps: [step('Number', v.n), step('Terms', terms.join(', '))] }
    },
    formula: 'a0 + 1/(a1 + 1/(a2 + ...)).',
    description: 'Compute the continued fraction representation of a number.',
    interpretation: 'Continued fractions provide optimal rational approximations.'
}

export default calcDef
