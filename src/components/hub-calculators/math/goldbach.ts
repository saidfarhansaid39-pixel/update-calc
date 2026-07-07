import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 4 && parseFloat(v) % 2 === 0 && Number(v) <= 10000, 'Even integer 4-10000') }),
    fields: [numField('n', 'Even number (4-10000)', { min: 4, max: 10000, step: '2' })],
    defaults: { n: '28' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const isPrime = (x: number) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true }
      const pairs: string[] = []; for (let i = 2; i <= nVal / 2; i++) if (isPrime(i) && isPrime(nVal - i)) pairs.push(`(${i}, ${nVal - i})`)
      return { result: pairs.length > 0 ? pairs.join(', ') : 'No representation found', label: 'Goldbach pairs', steps: [step('n', '' + nVal), step('Pairs found', '' + pairs.length)] }
    },
    formula: 'Goldbach conjecture: every even n > 2 is sum of two primes.',
    description: 'Find Goldbach prime pairs for an even number.',
    interpretation: 'Every even integer greater than 2 is the sum of two primes.'
}

export default calcDef
