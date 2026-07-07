import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)) && Number(v) <= 10000, '1-10000 integer') }),
    fields: [numField('n', 'n (1-10000)', { min: 1, max: 10000, step: '1' })],
    defaults: { n: '30' },
    compute: (v) => {
      let nVal = Math.round(n(v.n)); let count = 0; let hasSq = false
      for (let p = 2; p * p <= nVal && !hasSq; p++) {
        if (nVal % p === 0) { let c = 0; while (nVal % p === 0) { nVal /= p; c++ }; if (c > 1) hasSq = true; count++ }
      }
      if (nVal > 1) count++
      const mu = hasSq ? 0 : (count % 2 === 0 ? 1 : -1)
      return { result: mu, label: '�(n)', steps: [step('Distinct primes', '' + count), step('Square-free', hasSq ? 'No' : 'Yes'), step('�(n)', '' + mu)] }
    },
    formula: '�(n) = 0 if n has squared prime factor; (-1)^k if product of k distinct primes.',
    description: 'Calculate the M�bius function �(n).',
    interpretation: '�(n) is 0 if n has a repeated prime factor, 1 or -1 otherwise.'
}

export default calcDef
