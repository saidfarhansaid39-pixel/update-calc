import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Value (x)')],
    defaults: { a: '1' },
    compute: (v) => {
      const x = n(v.a)
      const result = Math.atan(x) * (180 / Math.PI)
      return { result: result.toFixed(4), label: 'arctan(x) in degrees', steps: [step('Formula:', 'arctan(' + x + ')'), step('Result:', '' + result.toFixed(4) + 'deg')] }
    },
    formula: 'arctan(x) in degrees',
    description: 'Calculate the inverse tangent (arctan) of a value.',
    interpretation: 'The angle whose tangent is the given value, returned in degrees.'
}

export default calcDef
