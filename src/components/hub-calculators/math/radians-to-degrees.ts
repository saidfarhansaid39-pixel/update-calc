import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (radians)')],
    defaults: { a: '3.14159' },
    compute: (v) => {
      const rad = n(v.a)
      const deg = rad * (180 / Math.PI)
      return { result: deg.toFixed(4), label: 'Degrees', steps: [step('Formula:', '' + deg.toFixed(4) + ' = ' + rad + ' x 180/pi'), step('Result:', '' + rad + ' rad = ' + deg.toFixed(4) + 'deg')] }
    },
    formula: 'deg = rad x 180/pi',
    description: 'Convert radians to degrees.',
    interpretation: 'The angle expressed in degrees.'
}

export default calcDef
