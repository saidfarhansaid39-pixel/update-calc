import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 15, '0-15 integer') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('n', 'Exponent n (0-15)', { min: 0, max: 15, step: '1' })],
    defaults: { a: '1', b: '1', n: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), nVal = Math.round(n(v.n)); const terms: string[] = []
      for (let k = 0; k <= nVal; k++) { const coeff = Math.round(fact(nVal) / (fact(k) * fact(nVal - k))); const aTerm = nVal - k === 0 ? '' : a === 1 ? 'x' : a + 'x'; const bTerm = k === 0 ? '' : b === 1 ? 'y' : b + 'y'; const coeffStr = coeff === 1 ? '' : '' + coeff; terms.push(coeffStr + (aTerm || '1') + (k > 0 ? '^' + k : '') + (bTerm ? bTerm + (nVal - k > 0 ? '^' + (nVal - k) : '') : '')) }
      return { result: terms.join(' + '), label: 'Expansion', steps: [step('(a+b)^' + nVal, terms.join(' + '))] }
    },
    formula: '(a+b)n = S C(n,k) an?? b?.',
    description: 'Expand binomials using the binomial theorem.',
    interpretation: 'Binomial expansion gives the sum of weighted terms.'
}

export default calcDef
