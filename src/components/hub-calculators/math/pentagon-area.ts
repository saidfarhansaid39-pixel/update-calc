import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '5' },
    compute: (v) => {
      const s = n(v.a)
      const area = (1 / 4) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * s * s
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = 1/4sqrt(5(5+2sqrt(5))) x ' + s + '2 = ' + area.toFixed(4))] }
    },
    formula: 'A = 1/4sqrt(5(5+2sqrt(5)))s2',
    description: 'Calculate the area of a regular pentagon.',
    interpretation: 'The area enclosed by a regular pentagon with the given side length.'
}

export default calcDef
