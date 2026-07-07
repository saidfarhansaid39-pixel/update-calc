import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '4' },
    compute: (v) => {
      const s = n(v.a)
      return { result: s * s * s, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = ' + s + '3 = ' + (s * s * s))] }
    },
    formula: 'V = s3',
    description: 'Calculate the volume of a cube.',
    interpretation: 'The space occupied by a cube with the given side length.'
}

export default calcDef
