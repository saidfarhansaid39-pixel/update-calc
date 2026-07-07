import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '30' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      return { result: Math.sin(rad), label: 'sin(theta)', steps: [step('Convert:', deg + 'deg = ' + rad.toFixed(6) + ' rad'), step('Result:', 'sin(' + deg + 'deg) = ' + Math.sin(rad).toFixed(6))] }
    },
    formula: 'sin(theta)',
    description: 'Calculate the sine of an angle.',
    interpretation: 'The sine of the given angle in degrees.'
}

export default calcDef
