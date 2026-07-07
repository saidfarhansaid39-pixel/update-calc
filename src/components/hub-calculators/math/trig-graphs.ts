import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Angle (degrees)')],
    defaults: { a: '45' },
    compute: (v) => {
      const deg = n(v.a), rad = deg * (Math.PI / 180)
      const sin = Math.sin(rad), cos = Math.cos(rad), tan = Math.tan(rad)
      return { result: sin.toFixed(6) + ', ' + cos.toFixed(6) + ', ' + (Math.abs(tan) > 1e10 ? 'undefined' : tan.toFixed(6)), label: 'sin, cos, tan', steps: [step('sin(' + deg + ')', '' + sin.toFixed(6)), step('cos(' + deg + ')', '' + cos.toFixed(6)), step('tan(' + deg + ')', '' + (Math.abs(tan) > 1e10 ? 'undefined' : tan.toFixed(6)))] }
    },
    formula: 'sin(x), cos(x), tan(x) evaluated at given angle.',
    description: 'Evaluate trigonometric functions for graphing reference.',
    interpretation: 'The sin, cos, and tan values for the given angle.'
}

export default calcDef
