import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Radius (r)'), numField('b', 'Height (h)')],
    defaults: { a: '3', b: '7' },
    compute: (v) => {
      const r = n(v.a), h = n(v.b)
      const area = 2 * Math.PI * r * (r + h)
      return { result: area, label: 'Surface Area', unit: 'units2', steps: [step('Formula:', 'A = 2pi x ' + r + ' x (' + r + ' + ' + h + ') = ' + area.toFixed(4))] }
    },
    formula: 'A = 2pir(r + h)',
    description: 'Calculate the surface area of a cylinder.',
    interpretation: 'The total surface area of a cylinder including top and bottom.'
}

export default calcDef
