import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0') }),
    fields: [numField('a', 'Total items (n)', { min: 0, step: '1' }), numField('b', 'Items chosen (r)', { min: 0, step: '1' })],
    defaults: { a: '10', b: '3' },
    compute: (v) => {
      const np = Math.round(n(v.a)), r = Math.round(n(v.b))
      if (r > np) return { result: 0, label: 'nPr (r > n)', steps: [step('Error:', 'Cannot choose ' + r + ' from ' + np + ' (r > n)')] }
      const result = fact(np) / fact(np - r)
      return { result, label: 'P(' + np + ', ' + r + ')', steps: [step('Formula:', 'nPr = ' + np + '! / (' + np + ' - ' + r + ')!'), step('Result:', '' + result)] }
    },
    formula: 'nPr = n! / (n-r)!',
    description: 'Calculate the number of permutations (n permute r).',
    interpretation: 'The number of ways to choose and arrange r items from n items where order matters.'
}

export default calcDef
