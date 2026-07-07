import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Math.abs(parseFloat(v)) <= 1, 'Must be between -1 and 1') }),
    fields: [numField('a', 'Value (x)')],
    defaults: { a: '0.5' },
    compute: (v) => {
      const x = n(v.a)
      const result = Math.acos(x) * (180 / Math.PI)
      return { result: result.toFixed(4), label: 'arccos(x) in degrees', steps: [step('Formula:', 'arccos(' + x + ')'), step('Result:', '' + result.toFixed(4) + 'deg')] }
    },
    formula: 'arccos(x) in degrees',
    description: 'Calculate the inverse cosine (arccos) of a value.',
    interpretation: 'The angle whose cosine is the given value, returned in degrees.'
}

export default calcDef
