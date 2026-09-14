import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)), 'Must be positive integer') }),
    fields: [numField('a', 'Number n', { min: 1, step: '1' })],
    defaults: { a: '17' },
    compute: (v) => {
      const num = Math.round(n(v.a))
      if (num < 2) return { result: 'Not prime', label: 'Prime Check', steps: [step(num + ' is less than 2', 'Not prime by definition')] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
      const sqrtN = Math.sqrt(num)
      for (let i = 2; i <= sqrtN; i++) if (num % i === 0) return { result: 'Composite', label: 'Prime Check', steps: [step('Check:', '' + num + ' is divisible by ' + i), step('Result:', 'Not prime (composite)')] }
      return { result: 'Prime', label: 'Prime Check', steps: [step('Check:', 'No divisors found up to sqrt(' + num + ')'), step('Result:', '' + num + ' is prime')] }
    },
    formula: 'Trial division up to sqrt(n)',
    description: 'Check if a positive integer is prime.',
    interpretation: 'A prime number has exactly two factors: 1 and itself.',
    presets: [
      { label: 'Small Prime', values: { a: '7' } },
      { label: 'Composite', values: { a: '12' } },
      { label: 'Large Prime', values: { a: '97' } }
    ]
}

export default calcDef
