import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base Area (B)'), numField('b', 'Height (h)')],
    defaults: { a: '25', b: '10' },
    compute: (v) => {
      const B = n(v.a), h = n(v.b)
      return { result: B * h, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = ' + B + ' x ' + h + ' = ' + (B * h))] }
    },
    formula: 'V = Bh',
    description: 'Calculate the volume of a prism.',
    interpretation: 'The space occupied by a prism with the given base area and height.'
}

export default calcDef
