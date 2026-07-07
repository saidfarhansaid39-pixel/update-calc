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
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = 4/3 x pi x ' + r + '3'), step('Result:', 'V = ' + vol.toFixed(4))] }
    },
    formula: 'V = 4/3pir3',
    description: 'Calculate the volume of a sphere.',
    interpretation: 'The space occupied by a sphere with the given radius.'
}

export default calcDef
