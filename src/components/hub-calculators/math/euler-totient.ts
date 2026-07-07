import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)) && Number(v) <= 100000, '1-100000 integer') }),
    fields: [numField('n', 'n (1-100000)', { min: 1, max: 100000, step: '1' })],
    defaults: { n: '36' },
    compute: (v) => {
      let nVal = Math.round(n(v.n)), result = nVal, temp = nVal
      for (let p = 2; p * p <= temp; p++) { if (temp % p === 0) { while (temp % p === 0) temp /= p; result -= result / p } }
      if (temp > 1) result -= result / temp
      return { result: Math.round(result), label: 'f(n)', steps: [step('n', '' + nVal), step('f(n)', '' + Math.round(result))] }
    },
    formula: 'f(n) = n ? (1 - 1/p) for primes p|n.',
    description: 'Calculate Euler totient function f(n) � count of coprime numbers < n.',
    interpretation: 'Number of integers k < n with gcd(k,n) = 1.'
}

export default calcDef
