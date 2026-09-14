import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 2, 'Integer >= 2') }),
    fields: [numField('n', 'Number n', { min: 2, step: '1' })],
    defaults: { n: '17' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const isPrime = (x: number) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true }
      const tp = isPrime(nVal) && (isPrime(nVal + 2) || isPrime(nVal - 2))
      const msg = tp ? (isPrime(nVal + 2) ? '(' + nVal + ', ' + (nVal + 2) + ')' : '(' + (nVal - 2) + ', ' + nVal + ')') : 'Not part of a twin prime pair'
      return { result: msg, label: 'Twin Prime Check', steps: [step('Is ' + nVal + ' prime?', isPrime(nVal) ? 'Yes' : 'No'), step('n+2 prime?', isPrime(nVal + 2) ? 'Yes' : 'No'), step('n-2 prime?', nVal > 2 ? (isPrime(nVal - 2) ? 'Yes' : 'No') : 'N/A')] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Twin primes are prime pairs p, p+2 (or p-2, p).',
    description: 'Check if a number is part of a twin prime pair.',
    interpretation: 'Twin primes are pairs of primes that differ by 2.',
    presets: [
      { label: 'Small Prime', values: { a: '7' } },
      { label: 'Composite', values: { a: '12' } },
      { label: 'Large Prime', values: { a: '97' } }
    ]
}

export default calcDef
