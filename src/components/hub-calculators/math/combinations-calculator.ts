import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be >= 0') }),
    fields: [numField('a', 'Total items (n)', { min: 0, step: '1' }), numField('b', 'Items chosen (r)', { min: 0, step: '1' })],
    defaults: { a: '10', b: '3' },
    compute: (v) => {
      const nc = Math.round(n(v.a)), r = Math.round(n(v.b))
      if (r > nc) return { result: 0, label: 'nCr (r > n)', steps: [step('Error:', 'Cannot choose ' + r + ' from ' + nc + ' (r > n)')] }
      const result = fact(nc) / (fact(r) * fact(nc - r))
      return { result, label: 'C(' + nc + ', ' + r + ')', steps: [step('Formula:', 'nCr = ' + nc + '! / (' + r + '! \u00d7 (' + nc + ' - ' + r + ')!)'), step('Result:', '' + result)] }
    },
    formula: 'nCr = n! / (r! x (n-r)!)',
    description: 'Calculate the number of combinations (n choose r).',
    interpretation: 'The number of ways to choose r items from n items where order does not matter.',
    presets: [
      { label: '5 choose 2', values: { a: '5', b: '2' } },
      { label: '52 choose 5', values: { a: '52', b: '5' } },
    ]
}

export default calcDef
