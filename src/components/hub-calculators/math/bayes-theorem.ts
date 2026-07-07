import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 && parseFloat(v) <= 1, '0-1'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 && parseFloat(v) <= 1, '0-1'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 && parseFloat(v) <= 1, '0-1') }),
    fields: [numField('a', 'P(A) prior'), numField('b', 'P(B|A) likelihood'), numField('c', 'P(B) marginal')],
    defaults: { a: '0.01', b: '0.9', c: '0.108' },
    compute: (v) => {
      const prior = n(v.a), likelihood = n(v.b), marginal = n(v.c)
      const posterior = (prior * likelihood) / marginal
      return { result: (posterior * 100).toFixed(2), label: 'P(A|B) %', steps: [step('Bayes formula', 'P(A|B) = P(B|A) x P(A) / P(B)'), step('Substitute', `(${likelihood} x ${prior}) / ${marginal}`), step('Posterior', (posterior * 100).toFixed(2) + '%')] }
    },
    formula: 'P(A|B) = P(B|A) x P(A) / P(B).',
    description: 'Calculate posterior probability using Bayes theorem.',
    interpretation: 'The updated probability of A given evidence B.'
}

export default calcDef
