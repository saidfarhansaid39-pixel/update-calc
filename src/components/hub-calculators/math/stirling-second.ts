import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 10, '0-10 integer'), k: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), '0+ integer') }),
    fields: [numField('n', 'n (0-10)', { min: 0, max: 10, step: '1' }), numField('k', 'k (0 to n)', { min: 0, step: '1' })],
    defaults: { n: '4', k: '2' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)), k = Math.round(n(v.k)); const S = Array.from({ length: nVal + 1 }, () => Array(nVal + 1).fill(0)); S[0][0] = 1
      for (let i = 1; i <= nVal; i++) for (let j = 1; j <= i; j++) S[i][j] = S[i - 1][j - 1] + j * S[i - 1][j]
      return { result: S[nVal][k], label: 'S(n,k)', steps: [step('S(' + n + ',' + k + ')', '' + S[nVal][k])] }
    },
    formula: 'S(n,k) = S(n-1,k-1) + k�S(n-1,k).',
    description: 'Calculate Stirling numbers of the second kind S(n,k).',
    interpretation: 'Number of ways to partition n elements into k non-empty subsets.'
}

export default calcDef
