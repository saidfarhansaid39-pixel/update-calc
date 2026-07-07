import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 15, '0-15 integer') }),
    fields: [numField('n', 'n (0-15)', { min: 0, max: 15, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const dp = [[1]]; for (let i = 1; i <= nVal; i++) { dp[i] = [dp[i - 1][i - 1]]; for (let j = 1; j <= i; j++) dp[i][j] = dp[i][j-1] + dp[i-1][j-1] }
      const result = dp[nVal][0]; return { result, label: 'B?', steps: [step('n', '' + nVal), step('Bell number', '' + result)] }
    },
    formula: 'B0 = 1, B??1 = S C(n,k) B?.',
    description: 'Calculate the nth Bell number (number of set partitions).',
    interpretation: 'Number of ways to partition a set of n elements.'
}

export default calcDef
