import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Side Length (s)')],
    defaults: { a: '4' },
    compute: (v) => {
      const s = n(v.a)
      const vol = s * s * s
      const area = 6 * s * s
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = ' + s + '3 = ' + vol), step('Surface area:', 'S = 6 x ' + s + '2 = ' + area)] }
    },
    formula: 'V = s3, S = 6s2',
    description: 'Calculate cube volume and surface area.',
    interpretation: 'The volume and surface area of a cube with the given side length.'
}

export default calcDef
