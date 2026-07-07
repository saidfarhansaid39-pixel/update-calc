import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base Area (B)'), numField('b', 'Height (h)')],
    defaults: { a: '25', b: '10' },
    compute: (v) => {
      const B = n(v.a), h = n(v.b)
      const vol = (1 / 3) * B * h
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 1/3 x ' + B + ' x ' + h + ' = ' + vol.toFixed(4))] }
    },
    formula: 'V = 1/3Bh',
    description: 'Calculate the volume of a pyramid.',
    interpretation: 'The space occupied by a pyramid with the given base area and height.'
}

export default calcDef
