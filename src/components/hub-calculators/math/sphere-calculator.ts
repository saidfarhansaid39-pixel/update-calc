import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Radius (r)')],
    defaults: { a: '5' },
    compute: (v) => {
      const r = n(v.a)
      const vol = (4 / 3) * Math.PI * Math.pow(r, 3)
      const area = 4 * Math.PI * r * r
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 4/3 x pi x ' + r + '3 = ' + vol.toFixed(4)), step('Surface area:', 'S = 4 x pi x ' + r + '2 = ' + area.toFixed(4))] }
    },
    formula: 'V = 4/3pir3, S = 4pir2',
    description: 'Calculate sphere volume and surface area.',
    interpretation: 'The volume and surface area of a sphere with the given radius.'
}

export default calcDef
