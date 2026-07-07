import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '60' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sinHalf = Math.sin(rad / 2), cosHalf = Math.cos(rad / 2)
      return { result: sinHalf, label: 'sin(theta/2)', steps: [step('Input:', 'theta = ' + deg + 'deg'), step('sin(theta/2):', 'sin(' + (deg / 2) + 'deg) = ' + sinHalf.toFixed(6)), step('cos(theta/2):', 'cos(' + (deg / 2) + 'deg) = ' + cosHalf.toFixed(6))], extras: [{ label: 'cos(theta/2)', value: cosHalf }] }
    },
    formula: 'sin(theta/2) = +/- sqrt((1-cos(theta))/2)',
    description: 'Calculate half angle trigonometric values.',
    interpretation: 'The sin and cos of half the given angle.'
}

export default calcDef
