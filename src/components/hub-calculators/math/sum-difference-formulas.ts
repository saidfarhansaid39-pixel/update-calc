import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle A (degrees)'), numField('b', 'Angle B (degrees)')],
    defaults: { a: '30', b: '45' },
    compute: (v) => {
      const A = n(v.a), B = n(v.b), radA = A * (Math.PI / 180), radB = B * (Math.PI / 180)
      const sinSum = Math.sin(radA + radB), cosSum = Math.cos(radA + radB)
      const sinDiff = Math.sin(radA - radB), cosDiff = Math.cos(radA - radB)
      return { result: sinSum, label: 'sin(A+B)', steps: [step('sin(A+B):', 'sin(' + A + ' + ' + B + ') = ' + sinSum.toFixed(6)), step('cos(A+B):', 'cos(' + A + ' + ' + B + ') = ' + cosSum.toFixed(6)), step('sin(A-B):', 'sin(' + A + ' - ' + B + ') = ' + sinDiff.toFixed(6)), step('cos(A-B):', 'cos(' + A + ' - ' + B + ') = ' + cosDiff.toFixed(6))], extras: [{ label: 'cos(A+B)', value: cosSum }, { label: 'sin(A-B)', value: sinDiff }, { label: 'cos(A-B)', value: cosDiff }] }
    },
    formula: 'sin(A+/-B) = sinAcosB +/- cosAsinB, cos(A+/-B) = cosAcosB -/+ sinAsinB',
    description: 'Calculate sum and difference formulas for two angles.',
    interpretation: 'The trigonometric values of the sum and difference of two angles.'
}

export default calcDef
