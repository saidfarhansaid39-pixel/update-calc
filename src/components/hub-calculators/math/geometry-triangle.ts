import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base (b)'), numField('b', 'Height (h)')],
    defaults: { a: '10', b: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      return { result: 0.5 * a * b, label: 'Area', unit: 'units2', steps: [step('Area:', 'A = 1/2 x ' + a + ' x ' + b + ' = ' + (0.5 * a * b))] }
    },
    formula: 'A = 1/2 x b x h',
    description: 'Calculate the area of a triangle.',
    interpretation: 'The area enclosed by the triangle.'
}

export default calcDef
