import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ r: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), theta: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('r', 'Radius (r)'), numField('theta', 'Angle (degrees)')],
    defaults: { r: '5', theta: '60' },
    compute: (v) => {
      const r = n(v.r), thetaDeg = n(v.theta); const thetaRad = thetaDeg * (Math.PI / 180); const arcLength = r * thetaRad
      return { result: arcLength.toFixed(4), label: 'Arc length', steps: [step('Angle in rad', thetaRad.toFixed(6) + ' rad'), step('Arc length = r x theta', r + ' x ' + thetaRad.toFixed(6) + ' = ' + arcLength.toFixed(4))] }
    },
    formula: 's = r x theta (theta in radians).',
    description: 'Calculate the arc length of a circle sector.',
    interpretation: 'The distance along the circular arc.'
}

export default calcDef
