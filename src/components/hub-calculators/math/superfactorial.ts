import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 6, '0-6 integer') }),
    fields: [numField('n', 'n (0-6)', { min: 0, max: 6, step: '1' })],
    defaults: { n: '4' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let result = 1
      for (let i = 1; i <= nVal; i++) result *= fact(i)
      return { result, label: 'sf(n)', steps: [step('n', '' + nVal), step('sf(n) = 1! x 2! x ... x n!', '' + result)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'sf(n) = 1! x 2! x ... x n!.',
    description: 'Calculate the superfactorial (product of factorials).',
    interpretation: 'The product of the first n factorials.',
    presets: [
      { label: 'Small 5', values: { a: '5' } },
      { label: 'Medium 10', values: { a: '10' } },
      { label: 'Large 20', values: { a: '20' } }
    ]
}

export default calcDef
