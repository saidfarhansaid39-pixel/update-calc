import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 15, 'Must be 0-15') }),
    fields: [numField('a', 'First term (a)'), numField('b', 'Second term (b)'), numField('c', 'Power (n)', { min: 0, max: 15, step: '1' })],
    defaults: { a: '1', b: '1', c: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), exp = Math.round(n(v.c))
      const terms: string[] = []
      for (let k = 0; k <= exp; k++) {
        const coef = fact(exp) / (fact(k) * fact(exp - k))
        const term = coef + (exp - k > 0 ? 'a' + (exp - k > 1 ? '^' + (exp - k) : '') : '') + (k > 0 ? 'b' + (k > 1 ? '^' + k : '') : '')
        terms.push(term)
      }
      return { result: terms.join(' + '), label: '(a + b)^' + exp, steps: [step('Formula:', '(a + b)^' + exp + ' = Sum(nCk x a^(n-k) x b^k) from k=0 to ' + exp), step('Expansion:', terms.join(' + '))] }
    },
    formula: '(a + b)^n = Sum(nCk � a^(n-k) � b^k)',
    description: 'Expand a binomial expression using the binomial theorem.',
    interpretation: 'The expanded form of (a + b) raised to the given power.'
}

export default calcDef
