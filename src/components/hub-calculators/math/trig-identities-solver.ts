import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '45' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const s = Math.sin(rad), c = Math.cos(rad), t = Math.tan(rad)
      const check1 = s * s + c * c
      const check2 = t - (s / c)
      return { result: check1.toFixed(10), label: 'sin2 + cos2', steps: [step('sin(theta):', '' + s.toFixed(6)), step('cos(theta):', '' + c.toFixed(6)), step('tan(theta):', '' + (Math.abs(t) > 1e15 ? 'undefined' : t.toFixed(6))), step('Pythagorean identity:', 'sin2 + cos2 = ' + s.toFixed(6) + '2 + ' + c.toFixed(6) + '2 = ' + check1.toFixed(10)), step('Quotient identity:', 'tan - sin/cos = ' + (t > 1e10 ? '0' : Math.abs(check2).toFixed(10)))], extras: [{ label: 'sin(theta)', value: s }, { label: 'cos(theta)', value: c }, { label: 'tan(theta)', value: Math.abs(t) > 1e15 ? 'Undefined' : t }] }
    },
    formula: 'sin2(theta) + cos2(theta) = 1, tan(theta) = sin(theta)/cos(theta)',
    description: 'Verify fundamental trigonometric identities for a given angle.',
    interpretation: 'The Pythagorean and quotient identities hold (sin2 + cos2 = 1).'
}

export default calcDef
