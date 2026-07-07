import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Radius (r)'), numField('b', 'Angle (theta in degrees)')],
    defaults: { a: '5', b: '60' },
    compute: (v) => {
      const r = n(v.a), theta = n(v.b)
      const thetaRad = theta * (Math.PI / 180)
      const area = 0.5 * r * r * thetaRad
      return { result: area, label: 'Sector Area', unit: 'units2', steps: [step('Angle in rad', thetaRad.toFixed(6) + ' rad'), step('Area = 1/2 x ' + r + '2 x theta', area.toFixed(6))] }
    },
    formula: 'A = 1/2r2theta (theta in radians)',
    description: 'Calculate the area of a circular sector.',
    interpretation: 'The area of the sector defined by the given radius and central angle.'
}

export default calcDef
