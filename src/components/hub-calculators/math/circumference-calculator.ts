import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ r: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('r', 'Radius (r)')],
    defaults: { r: '5' },
    compute: (v) => {
      const r = n(v.r)
      const c = 2 * Math.PI * r
      return { result: c, label: 'Circumference', unit: 'units', steps: [step('Formula:', 'C = 2pi x ' + r), step('Result:', 'C = ' + c.toFixed(6))] }
    },
    formula: 'C = 2pir',
    description: 'Calculate the circumference of a circle.',
    interpretation: 'The distance around the circle (perimeter).'
}

export default calcDef
