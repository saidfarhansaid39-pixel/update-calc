import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '4' },
    compute: (v) => {
      const s = n(v.a)
      return { result: 6 * s * s, label: 'Surface Area', unit: 'units2', steps: [step('Formula:', 'A = 6 x ' + s + '2 = ' + (6 * s * s))] }
    },
    formula: 'A = 6s2',
    description: 'Calculate the surface area of a cube.',
    interpretation: 'The total surface area of all six faces of a cube.'
}

export default calcDef
