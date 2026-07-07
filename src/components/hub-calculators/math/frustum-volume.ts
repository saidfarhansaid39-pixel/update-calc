import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Top Radius (r)'), numField('b', 'Bottom Radius (R)'), numField('c', 'Height (h)')],
    defaults: { a: '2', b: '4', c: '6' },
    compute: (v) => {
      const r = n(v.a), R = n(v.b), h = n(v.c)
      const vol = (1 / 3) * Math.PI * h * (R * R + R * r + r * r)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = 1/3pi x ' + h + ' x (' + R + '2 + ' + R + 'x' + r + ' + ' + r + '2)'), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = 1/3pih(R2 + Rr + r2)',
    description: 'Calculate the volume of a conical frustum.',
    interpretation: 'The space occupied by a truncated cone with the given dimensions.'
}

export default calcDef
