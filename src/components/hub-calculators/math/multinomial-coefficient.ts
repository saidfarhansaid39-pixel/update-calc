import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0') }),
    fields: [numField('a', 'Total items (n)', { min: 0, step: '1' }), numField('b', 'Group size (k)', { min: 0, step: '1' })],
    defaults: { a: '10', b: '3' },
    compute: (v) => {
      const nc = Math.round(n(v.a)), k = Math.round(n(v.b))
      if (k > nc) return { result: 0, label: 'Error', steps: [step('Error:', 'k cannot exceed n')] }
      const result = fact(nc) / (fact(k) * fact(nc - k))
      return { result, label: 'C(' + nc + ', ' + k + ')', steps: [step('Formula:', 'Simplified to binomial coefficient'), step('Result:', '' + result)] }
    },
    formula: 'n! / (k1! x k2! x ... x km!)',
    description: 'Calculate multinomial coefficient (simplified to binomial case).',
    interpretation: 'The number of ways to divide n items into groups.'
}

export default calcDef
