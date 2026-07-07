import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base (b)'), numField('b', 'Height (h)')],
    defaults: { a: '6', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const area = 0.5 * a * b
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = 1/2 x ' + a + ' x ' + b), step('Result:', 'A = ' + area.toFixed(4))] }
    },
    formula: 'A = 1/2bh',
    description: 'Calculate the area of a triangle.',
    interpretation: 'The area enclosed by a triangle with the given base and height.'
}

export default calcDef
