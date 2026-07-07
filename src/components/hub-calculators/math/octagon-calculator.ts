import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '5' },
    compute: (v) => {
      const s = n(v.a)
      const area = 2 * (1 + Math.sqrt(2)) * s * s
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = 2(1+sqrt(2)) x ' + s + '2 = ' + area.toFixed(4))] }
    },
    formula: 'A = 2(1+sqrt(2))s2',
    description: 'Calculate the area of a regular octagon.',
    interpretation: 'The area enclosed by a regular octagon with the given side length.'
}

export default calcDef
