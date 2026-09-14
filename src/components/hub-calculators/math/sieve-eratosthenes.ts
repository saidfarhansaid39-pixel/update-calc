import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2 && Number.isInteger(Number(v)), 'Must be integer >= 2') }),
    fields: [numField('a', 'Upper limit n', { min: 2, step: '1' })],
    defaults: { a: '30' },
    compute: (v) => {
      const limit = Math.min(Math.round(n(v.a)), 1000)
      const sieve: boolean[] = Array(limit + 1).fill(true)
      sieve[0] = false; sieve[1] = false
      for (let i = 2; i * i <= limit; i++) if (sieve[i]) for (let j = i * i; j <= limit; j += i) sieve[j] = false
      const primes: number[] = []
      for (let i = 2; i <= limit; i++) if (sieve[i]) primes.push(i)
      return { result: primes.length + ' primes up to ' + limit, label: 'Sieve Result', steps: [step('Limit:', '' + limit), step('Primes found:', primes.join(', '))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Sieve of Eratosthenes',
    description: 'Find all prime numbers up to a given limit.',
    interpretation: 'All prime numbers less than or equal to the given limit.',
    presets: [
      { label: 'Up to 20', values: { a: '20' } },
      { label: 'Up to 50', values: { a: '50' } }
    ]
}

export default calcDef
