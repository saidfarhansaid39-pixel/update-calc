import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 100, '0-100 integer') }),
    fields: [numField('n', 'n (0-100)', { min: 0, max: 100, step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let a = 0, b = 1
      for (let i = 0; i < nVal; i++) { const t = a; a = b; b = t + b }
      return { result: a, label: 'F?', steps: [step('n', '' + nVal), step('F?', '' + a)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'F0 = 0, F1 = 1, F? = F??1 + F??2.',
    description: 'Calculate the nth Fibonacci number.',
    interpretation: 'Each term is the sum of the two preceding terms.',
    presets: [
      { label: 'Position 5', values: { a: '5' } },
      { label: 'Position 10', values: { a: '10' } },
      { label: 'Position 20', values: { a: '20' } }
    ]
}

export default calcDef
