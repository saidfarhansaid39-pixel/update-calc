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
      const area = 4 * Math.PI * Math.PI * R * r
      return { result: vol, label: 'Volume', unit: 'units3', steps: [step('Volume:', 'V = 2pi2 x ' + R + ' x ' + r + '2 = ' + vol.toFixed(4)), step('Surface area:', 'S = 4pi2 x ' + R + ' x ' + r + ' = ' + area.toFixed(4))] }
    },
    formula: 'V = 2pi2Rr2, S = 4pi2Rr',
    description: 'Calculate volume and surface area of a torus.',
    interpretation: 'The volume and surface area of a torus with given major and minor radii.'
}

export default calcDef
