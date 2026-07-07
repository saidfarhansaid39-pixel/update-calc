import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)), 'Must be integer >= 1') }),
    fields: [numField('a', 'Number n', { min: 1, step: '1' })],
    defaults: { a: '28' },
    compute: (v) => {
      const pn = Math.round(n(v.a))
      let sum = 0
      const divisors: number[] = []
      for (let i = 1; i < pn; i++) { if (pn % i === 0) { sum += i; divisors.push(i) } }
      return { result: sum === pn ? 'Yes, perfect number' : 'Not a perfect number', label: 'Check', steps: [step('Number:', '' + pn), step('Proper divisors:', divisors.join(', ')), step('Sum:', '' + sum), step('Result:', '' + (sum === pn ? pn + ' = ' + sum + ' (perfect)' : pn + ' != ' + sum + ' (not perfect)'))] }
    },
    formula: 'A perfect number equals the sum of its proper divisors.',
    description: 'Check if a positive integer is a perfect number.',
    interpretation: 'A perfect number equals the sum of its proper divisors (excluding itself).'
}

export default calcDef
