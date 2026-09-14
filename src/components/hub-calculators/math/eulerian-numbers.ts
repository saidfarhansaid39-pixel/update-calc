import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)) && Number(v) <= 10, '1-10 integer'), k: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), '0+ integer') }),
    fields: [numField('n', 'n (1-10)', { min: 1, max: 10, step: '1' }), numField('k', 'k (0 to n-1)', { min: 0, step: '1' })],
    defaults: { n: '4', k: '2' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)), k = Math.round(n(v.k)); const dp = Array.from({ length: nVal + 1 }, () => Array(nVal + 1).fill(0)); dp[1][0] = 1
      for (let i = 2; i <= nVal; i++) { dp[i][0] = 1; for (let j = 1; j < i; j++) dp[i][j] = (i - j) * dp[i - 1][j - 1] + (j + 1) * dp[i - 1][j] }
      return { result: dp[nVal][k], label: 'A(n,k)', steps: [step('A(' + n + ',' + k + ')', '' + dp[nVal][k])] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'A(n,k) = (n-k)A(n-1,k-1) + (k+1)A(n-1,k).',
    description: 'Calculate Eulerian numbers A(n,k) counting permutations with k ascents.',
    interpretation: 'Number of permutations of n with exactly k ascents.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
