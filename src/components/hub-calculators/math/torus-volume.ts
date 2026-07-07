import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Major Radius (R)'), numField('b', 'Minor Radius (r)')],
    defaults: { a: '5', b: '2' },
    compute: (v) => {
      const R = n(v.a), r = n(v.b)
      const vol = 2 * Math.PI * Math.PI * R * r * r
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Formula:', 'V = 2pi2 x ' + R + ' x ' + r + '2 = ' + vol.toFixed(4))] }
    },
    formula: 'V = 2pi2Rr2',
    description: 'Calculate the volume of a torus (donut shape).',
    interpretation: 'The space occupied by a torus with the given major and minor radii.'
}

export default calcDef
