import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)'), numField('b', 'b (top-right)'), numField('c', 'c (bottom-left)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '4', b: '7', c: '2', d: '6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d); const det = a * d - b * c
      if (Math.abs(det) < 1e-10) return { result: 'Matrix is singular', label: 'Inverse', steps: [step('det = 0', 'No inverse exists')] }
      const invA = d / det, invB = -b / det, invC = -c / det, invD = a / det
      return { result: `[[${invA.toFixed(4)}, ${invB.toFixed(4)}], [${invC.toFixed(4)}, ${invD.toFixed(4)}]]`, label: 'A?�', steps: [step('det', '' + det), step('Inverse', `[[${invA.toFixed(4)}, ${invB.toFixed(4)}], [${invC.toFixed(4)}, ${invD.toFixed(4)}]]`)] }
    },
    formula: 'A?� = 1/det � [[d, -b], [-c, a]].',
    description: 'Calculate the inverse of a 2x2 matrix.',
    interpretation: 'The matrix that when multiplied by the original yields identity.'
}

export default calcDef
