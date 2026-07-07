import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Integer >= 0'), k: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Integer >= 0'), p: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 1, '0-1') }),
    fields: [numField('n', 'Trials (n)', { min: 0, step: '1' }), numField('k', 'Successes (k)', { min: 0, step: '1' }), numField('p', 'Prob of success (p)')],
    defaults: { n: '10', k: '5', p: '0.5' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)), k = Math.round(n(v.k)), p = n(v.p)
      if (k > nVal) return { result: 'k cannot exceed n', label: 'Error' }
      const comb = fact(nVal) / (fact(k) * fact(nVal - k)); const prob = comb * Math.pow(p, k) * Math.pow(1 - p, nVal - k)
      return { result: prob.toFixed(6), label: 'P(X=k)', steps: [step('Combinations', 'C(' + nVal + ',' + k + ') = ' + Math.round(comb)), step('Probability', prob.toFixed(6)), step('Formula', 'C(n,k) x p^k x (1-p)^(n-k)')] }
    },
    formula: 'P(X=k) = C(n,k) x p^k x (1-p)^(n-k).',
    description: 'Calculate binomial probability for exactly k successes in n trials.',
    interpretation: 'The probability of exactly k successes in n independent trials.'
}

export default calcDef
