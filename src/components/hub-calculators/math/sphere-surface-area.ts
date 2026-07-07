import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Radius (r)')],
    defaults: { a: '5' },
    compute: (v) => {
      const r = n(v.a)
      const area = 4 * Math.PI * r * r
      return { result: area, label: 'Surface Area', unit: 'units2', steps: [step('Formula:', 'A = 4pi x ' + r + '2 = ' + area.toFixed(4))] }
    },
    formula: 'A = 4pir2',
    description: 'Calculate the surface area of a sphere.',
    interpretation: 'The total surface area of a sphere with the given radius.'
}

export default calcDef
