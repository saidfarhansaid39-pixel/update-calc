import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 20, '1-20 integer') }),
    fields: [numField('n', 'n (1-20)', { min: 1, max: 20, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const mp = Math.pow(2, nVal) - 1
      const isPrime = (x: number) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true }
      const pr = isPrime(mp)
      return { result: pr ? mp + ' (prime Mersenne)' : mp + ' (not prime)', label: 'M_' + nVal, steps: [step('M_' + nVal, '2^' + nVal + ' - 1 = ' + mp), step('Prime?', pr ? 'Yes - Mersenne prime!' : 'No')] }
    },
    formula: 'M_n = 2^n - 1. Mersenne prime if M_n is prime.',
    description: 'Check if a Mersenne number (2^n - 1) is prime.',
    interpretation: 'Mersenne primes are primes of the form 2^n - 1.'
}

export default calcDef
