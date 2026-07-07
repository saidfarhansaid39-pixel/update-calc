import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Percentage')],
    defaults: { a: '85' },
    compute: (v) => {
      const a = n(v.a)
      return { result: (a / 100).toFixed(6), label: 'Decimal', steps: [step('Formula:', '' + a + ' / 100 = ' + (a / 100).toFixed(6))] }
    },
    formula: 'decimal = percent / 100',
    description: 'Convert a percentage to a decimal.',
    interpretation: 'The percentage expressed as a decimal.'
}

export default calcDef
