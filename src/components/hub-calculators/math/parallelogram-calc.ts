import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base (b)'), numField('b', 'Height (h)')],
    defaults: { a: '8', b: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      return { result: a * b, label: 'Area', unit: 'units2', steps: [step('Area:', 'A = ' + a + ' x ' + b + ' = ' + (a * b))] }
    },
    formula: 'A = b x h',
    description: 'Calculate the area of a parallelogram.',
    interpretation: 'The area enclosed by a parallelogram with the given base and height.'
}

export default calcDef
