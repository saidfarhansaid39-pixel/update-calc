import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '30' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sin2 = Math.sin(2 * rad), cos2 = Math.cos(2 * rad), tan2val = Math.tan(2 * rad)
      return { result: sin2, label: 'sin(2theta)', steps: [step('Input:', 'theta = ' + deg + 'deg'), step('sin(2theta):', 'sin(' + (2 * deg) + 'deg) = ' + sin2.toFixed(6)), step('cos(2theta):', 'cos(' + (2 * deg) + 'deg) = ' + cos2.toFixed(6)), step('tan(2theta):', 'tan(' + (2 * deg) + 'deg) = ' + (Math.abs(tan2val) > 1e15 ? 'undefined' : tan2val.toFixed(6)))], extras: [{ label: 'cos(2theta)', value: cos2 }, { label: 'tan(2theta)', value: Math.abs(tan2val) > 1e15 ? 'Undefined' : tan2val }] }
    },
    formula: 'sin(2theta) = 2sin(theta)cos(theta), cos(2theta) = cos2(theta)-sin2(theta)',
    description: 'Calculate double angle trigonometric values.',
    interpretation: 'The sin, cos, and tan of twice the given angle.'
}

export default calcDef
