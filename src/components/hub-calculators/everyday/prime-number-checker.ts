import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ number: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'number', label: 'Number to Check', type: 'number', min: 1, step: '1' },
  ],
  defaults: { number: '97' },
  presets: [
    { label: 'Check 97 (prime)', values: { number: '97' } },
    { label: 'Check 100 (composite)', values: { number: '100' } },
    { label: 'Check 7919 (1000th prime)', values: { number: '7919' } },
    { label: 'Check 1 (neither)', values: { number: '1' } },
  ],
  compute: (v) => {
    const n = Math.floor(v.number)
    let isPrime = n > 1
    let divisorFound = 0
    for (let i = 2; i <= Math.sqrt(n) && isPrime; i++) {
      if (n % i === 0) { isPrime = false; divisorFound = i }
    }
    const sqrtVal = Math.sqrt(n)
    const checkedUpTo = Math.floor(sqrtVal)
    return { result: isPrime ? 1 : 0, label: isPrime ? `Prime` : 'Not Prime', unit: '',
      steps: [
        { label: 'Number to Check', value: `${n}` },
        { label: 'Square Root Bound', value: `√${n} = ${sqrtVal.toFixed(2)} → check divisors up to ${checkedUpTo}` },
        { label: 'Divisibility Test', value: isPrime ? `No factors found from 2 to ${checkedUpTo}` : `Divisible by ${divisorFound}: ${n} ÷ ${divisorFound} = ${n / divisorFound}` },
        { label: 'Factor Count', value: isPrime ? 'Exactly 2 (1 and itself)' : `${n / divisorFound} × ${divisorFound}` },
        { label: 'Even/Odd Check', value: n % 2 === 0 ? (n === 2 ? '2 is the only even prime' : `${n} is even → composite (unless n=2)`) : `${n} is odd` },
        { label: 'Classification', value: n <= 1 ? 'Neither prime nor composite (by definition)' : isPrime ? `${n} is PRIME` : `${n} is COMPOSITE` },
        { label: 'Prime Fact', value: isPrime ? `This prime has ${n.toString().length} digit(s)` : `${divisorFound} × ${n / divisorFound} = ${n}` },
        { label: 'Next/Prev Prime', value: isPrime ? `Prime #${n < 100 ? [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97].indexOf(n) + 1 : ''}` : `${n} is not prime` },
      ],
      extras: [
        { label: '🔢 What Makes a Prime?', value: 'A prime number has exactly two distinct positive factors: 1 and itself. 1 is neither prime nor composite by mathematical convention (it has only one factor).' },
        { label: '🔐 Cryptographic Importance', value: 'RSA encryption relies on the difficulty of factoring large primes (hundreds of digits). Breaking a 2048-bit RSA key would take classical computers longer than the age of the universe.' },
        { label: '🏆 Largest Known Prime', value: 'The largest known prime (as of 2024) is 2^82589933 − 1, with 24,862,048 digits. Discovered by GIMPS (Great Internet Mersenne Prime Search).' },
        { label: '🧮 The Sieve of Eratosthenes', value: 'Ancient Greek method: list numbers from 2 to n, then repeatedly mark multiples of each prime starting from 2. Unmarked numbers are prime. Still used as a teaching tool.' },
        { label: '📊 Distribution of Primes', value: 'Primes become less frequent as numbers grow. The Prime Number Theorem: about n/ln(n) primes below n. Near 10^6: ~1 in 14 numbers is prime. Near 10^9: ~1 in 21.' },
        { label: '🔑 Twin Primes', value: 'Twin primes are pairs differing by 2 (e.g., 11 & 13, 41 & 43). It\'s unknown if there are infinitely many — the Twin Prime Conjecture remains unproven.' },
        { label: '💡 Mersenne Primes', value: 'Primes of the form 2^p − 1 where p is prime. Named after Marin Mersenne. Only 51 known (as of 2024). The largest primes ever found are all Mersenne primes.' },
        { label: '🔍 Quick Divisibility Tests', value: '2: ends in even digit. 3: digit sum divisible by 3. 5: ends in 0 or 5. 7: double last digit, subtract from rest, repeat. 11: alternating sum of digits divisible by 11.' },
      ]
    }
  },
  description: 'Check if any positive integer is a prime number using trial division up to the square root. Identifies divisors for composite numbers and provides prime number facts and context.',
  formula: 'Test divisibility from 2 to √n. If any divisor is found, n is composite. If none found and n > 1, n is prime. 1 is neither prime nor composite by definition.',
  interpretation: 'Prime numbers are the "atoms" of arithmetic — every integer > 1 can be uniquely factored into primes (Fundamental Theorem of Arithmetic). They are fundamental to modern cryptography, with RSA encryption relying on the computational difficulty of factoring large semi-primes (products of two primes). The largest known prime (a Mersenne prime) has over 24 million digits. Primes become less common as numbers grow: about 1 in 21 numbers near 1 billion is prime. 2 is the only even prime; all other primes are odd.'
}

export default calcDef
