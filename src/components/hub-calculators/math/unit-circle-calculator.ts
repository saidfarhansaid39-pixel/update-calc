import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '45' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const x = Math.cos(rad), y = Math.sin(rad)
      return { result: '(' + x.toFixed(4) + ', ' + y.toFixed(4) + ')', label: 'Coordinates (x, y)', steps: [step('Formula:', '(cos(theta), sin(theta))'), step('Result:', '(cos(' + deg + 'deg), sin(' + deg + 'deg)) = (' + x.toFixed(4) + ', ' + y.toFixed(4) + ')')], extras: [{ label: 'x = cos', value: x }, { label: 'y = sin', value: y }] }
    },
    formula: '(x, y) = (cos(theta), sin(theta))',
    description: 'Find the coordinates of a point on the unit circle.',
    interpretation: 'The (x, y) coordinates on the unit circle for the given angle.'
}

export default calcDef
