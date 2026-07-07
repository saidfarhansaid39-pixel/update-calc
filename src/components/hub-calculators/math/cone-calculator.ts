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
      const slant = Math.sqrt(r * r + h * h)
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 1/3 x pi x ' + r + '2 x ' + h + ' = ' + vol.toFixed(4)), step('Slant height:', 'l = sqrt(' + r + '2 + ' + h + '2) = ' + slant.toFixed(4))] }
    },
    formula: 'V = 1/3pir2h, l = sqrt(r2 + h2)',
    description: 'Calculate cone volume and slant height.',
    interpretation: 'The volume of a cone and its slant height.'
}

export default calcDef
