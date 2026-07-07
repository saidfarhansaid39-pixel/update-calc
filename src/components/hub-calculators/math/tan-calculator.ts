import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '45' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const result = Math.tan(rad)
      return { result: Math.abs(result) > 1e15 ? 'Undefined' : result, label: 'tan(theta)', steps: [step('Convert:', deg + 'deg = ' + rad.toFixed(6) + ' rad'), step('Result:', 'tan(' + deg + 'deg) = ' + (Math.abs(result) > 1e15 ? 'undefined (asymptote)' : result.toFixed(6)))] }
    },
    formula: 'tan(theta)',
    description: 'Calculate the tangent of an angle.',
    interpretation: 'The tangent of the given angle in degrees.'
}

export default calcDef
