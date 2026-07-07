import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'x-component rate of change'), numField('b', 'y-component rate of change')],
    defaults: { a: '2', b: '-1' },
    compute: (v) => {
      const dQdx = n(v.a), dPdy = n(v.b)
      const curl = dQdx - dPdy
      return { result: curl.toFixed(4) + ' k', label: 'Curl (2D)', steps: [step('Formula:', 'curl = dQ/dx - dP/dy'), step('Result:', 'Curl = ' + curl.toFixed(4))] }
    },
    formula: 'curl F = (dQ/dx - dP/dy)k (2D)',
    description: 'Calculate the curl of a 2D vector field.',
    interpretation: 'The circulation density of the vector field at the given point.'
}

export default calcDef
