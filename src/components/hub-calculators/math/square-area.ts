import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '5' },
    compute: (v) => {
      const a = n(v.a)
      return { result: a * a, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = ' + a + '2 = ' + (a * a))] }
    },
    formula: 'A = s2',
    description: 'Calculate the area of a square.',
    interpretation: 'The area enclosed by a square with the given side length.'
}

export default calcDef
