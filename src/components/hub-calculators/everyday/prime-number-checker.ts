import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ number: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'number', label: 'Number to Check', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const n = Math.floor(v.number)
    let isPrime = n > 1
    let factors = ''
    for (let i = 2; i <= Math.sqrt(n) && isPrime; i++) {
      if (n % i === 0) { isPrime = false; factors = `${i}×${n/i}` }
    }
    return { result: isPrime ? 1 : 0, label: isPrime ? `Prime` : 'Not Prime', unit: '', steps: [{ label: 'Number', value: `${n}` }, { label: 'Divisibility Check', value: isPrime ? `No divisors found up to √${n}` : `Divisible by ${factors}` }, { label: 'Result', value: isPrime ? `${n} is prime` : `${n} is composite` }] }
  },
  description: 'Check if any positive integer is a prime number. Tests divisibility by all numbers up to the square root.',
  formula: 'A prime has exactly two factors: 1 and itself. Check divisibility from 2 to √n.',
  interpretation: 'Prime numbers are fundamental in cryptography. The largest known prime has 24+ million digits. Common primes: 2, 3, 5, 7, 11, 13. 1 is neither prime nor composite. 2 is the only even prime.'
}

export default calcDef
