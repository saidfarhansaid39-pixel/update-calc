import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ r: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('r', 'Radius (r)')],
    defaults: { r: '5' },
    compute: (v) => {
      const r = n(v.r)
      const area = Math.PI * r * r
      return { result: area, label: 'Area', unit: 'units2', steps: [step('Formula:', 'A = pi x ' + r + '2 = pi x ' + (r * r)), step('Result:', 'A = ' + area.toFixed(6))] }
    },
    formula: 'A = pir2',
    description: 'Calculate the area of a circle.',
    interpretation: 'The area enclosed by a circle of the given radius.'
}

export default calcDef
