import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1, 'Integer >= 1') }),
    fields: [numField('n', 'Number n', { min: 1, step: '1' })],
    defaults: { n: '28' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let sum = 0; const divisors: number[] = []
      for (let i = 1; i < nVal; i++) { if (nVal % i === 0) { sum += i; divisors.push(i) } }
      const classification = sum > nVal ? 'Abundant' : sum < nVal ? 'Deficient' : 'Perfect'
      return { result: classification, label: 'Classification', steps: [step('Divisors', divisors.join(', ')), step('Sum', '' + sum), step('Compared to n', nVal + ' vs ' + sum + ' => ' + classification)] }
    },
    formula: 'Sum of proper divisors. Abundant if sum > n, Deficient if sum < n, Perfect if sum = n.',
    description: 'Classify a number as abundant, deficient, or perfect.',
    interpretation: 'An abundant number has proper divisors summing to more than the number itself.'
}

export default calcDef
