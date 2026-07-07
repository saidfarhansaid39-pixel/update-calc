import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 10, '0-10 integer'), k: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), '0+ integer') }),
    fields: [numField('n', 'n (0-10)', { min: 0, max: 10, step: '1' }), numField('k', 'k (0 to n)', { min: 0, step: '1' })],
    defaults: { n: '4', k: '2' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)), k = Math.round(n(v.k)); const s = Array.from({ length: nVal + 1 }, () => Array(nVal + 1).fill(0)); s[0][0] = 1
      for (let i = 1; i <= nVal; i++) for (let j = 1; j <= i; j++) s[i][j] = s[i - 1][j - 1] - (i - 1) * s[i - 1][j]
      return { result: s[nVal][k], label: 's(n,k)', steps: [step('s(' + n + ',' + k + ')', '' + s[nVal][k])] }
    },
    formula: 's(n,k) = s(n-1,k-1) - (n-1)s(n-1,k).',
    description: 'Calculate Stirling numbers of the first kind s(n,k).',
    interpretation: 'Coefficients in expansion of falling factorial (x)?.'
}

export default calcDef
