import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Axis a'), numField('b', 'Axis b'), numField('c', 'Axis c')],
    defaults: { a: '4', b: '3', c: '2' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c)
      const vol = (4 / 3) * Math.PI * a * b * c
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = 4/3 x pi x ' + a + ' x ' + b + ' x ' + c), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = 4/3piabc',
    description: 'Calculate the volume of an ellipsoid.',
    interpretation: 'The space occupied by an ellipsoid with the given axis lengths.'
}

export default calcDef
