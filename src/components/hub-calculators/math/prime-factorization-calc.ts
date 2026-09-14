import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && Number.isInteger(Number(v)), 'Must be integer >= 2') }),
    fields: [numField('a', 'Number n', { min: 2, step: '1' })],
    defaults: { a: '84' },
    compute: (v) => {
      const nf = Math.round(n(v.a)); let temp = nf
      const factors: number[] = []
      for (let i = 2; i * i <= temp; i++) { while (temp % i === 0) { factors.push(i); temp /= i } }
      if (temp > 1) factors.push(temp)
      return { result: factors.join(' x '), label: 'Prime Factors', steps: [step('Number:', '' + nf), step('Factorization:', factors.join(' x '))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Prime factorization via trial division',
    description: 'Find the prime factors of a positive integer.',
    interpretation: 'The prime numbers whose product equals the original number.',
    presets: [
      { label: 'Small Prime', values: { a: '7' } },
      { label: 'Composite', values: { a: '12' } },
      { label: 'Large Prime', values: { a: '97' } }
    ]
}

export default calcDef
