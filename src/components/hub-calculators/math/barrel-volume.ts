import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Top Radius (r)'), numField('b', 'Middle Radius (R)'), numField('c', 'Height (h)')],
    defaults: { a: '2', b: '3', c: '6' },
    compute: (v) => {
      const r = n(v.a), R = n(v.b), h = n(v.c)
      const vol = (Math.PI * h / 3) * (2 * R * R + r * r)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = (pi x ' + h + '/3) x (2x' + R + '2 + ' + r + '2)'), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = (pih/3)(2R2 + r2)',
    description: 'Calculate the volume of a barrel-shaped container.',
    interpretation: 'The approximate volume of a barrel with the given dimensions.'
}

export default calcDef
