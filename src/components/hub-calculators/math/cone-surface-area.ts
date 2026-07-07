import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius (r)'), numField('b', 'Slant Height (l)')],
    defaults: { a: '3', b: '5' },
    compute: (v) => {
      const r = n(v.a), l = n(v.b)
      const area = Math.PI * r * (r + l)
      return { result: area, label: 'Surface Area', unit: 'units2', steps: [step('Formula:', 'A = pi x ' + r + ' x (' + r + ' + ' + l + ') = ' + area.toFixed(4))] }
    },
    formula: 'A = pir(r + l)',
    description: 'Calculate the surface area of a cone.',
    interpretation: 'The total surface area of a cone including the base.'
}

export default calcDef
