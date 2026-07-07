import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Side a'), numField('b', 'Angle B (degrees)'), numField('c', 'Side b (optional, 0 to skip)', { placeholder: '0 to solve for side' })],
    defaults: { a: '5', b: '30', c: '7' },
    compute: (v) => {
      const a = n(v.a), angleB = n(v.b), sideB = v.c ? n(v.c) : 0
      const bRad = angleB * (Math.PI / 180)
      if (sideB === 0) { const sideBcalc = (a * Math.sin(bRad)) / Math.sin(bRad); return { result: 'Need angle A', label: 'Incomplete', steps: [step('Note:', 'Law of sines: a/sin(A) = b/sin(B) = c/sin(C)')] } }
      const ratio = a / Math.sin(bRad)
      return { result: ratio.toFixed(4), label: 'a/sin(A) ratio', steps: [step('Law of sines:', 'a/sin(A) = b/sin(B) = c/sin(C)'), step('Ratio:', '' + ratio.toFixed(4))] }
    },
    formula: 'a/sin(A) = b/sin(B) = c/sin(C)',
    description: 'Apply the law of sines to solve triangles.',
    interpretation: 'The ratio of side length to sine of opposite angle.'
}

export default calcDef
