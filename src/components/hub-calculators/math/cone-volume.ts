import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius (r)'), numField('b', 'Height (h)')],
    defaults: { a: '3', b: '5' },
    compute: (v) => {
      const r = n(v.a), h = n(v.b)
      const vol = (1 / 3) * Math.PI * r * r * h
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = 1/3 x pi x ' + r + '2 x ' + h), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = 1/3pir2h',
    description: 'Calculate the volume of a cone.',
    interpretation: 'The space occupied by a cone with the given radius and height.'
}

export default calcDef
