import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '60' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      return { result: Math.cos(rad), label: 'cos(theta)', steps: [step('Convert:', deg + 'deg = ' + rad.toFixed(6) + ' rad'), step('Result:', 'cos(' + deg + 'deg) = ' + Math.cos(rad).toFixed(6))] }
    },
    formula: 'cos(theta)',
    description: 'Calculate the cosine of an angle.',
    interpretation: 'The cosine of the given angle in degrees.'
}

export default calcDef
