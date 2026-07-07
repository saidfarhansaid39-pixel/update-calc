import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), e: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), f: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Ax'), numField('b', 'Ay'), numField('c', 'Bx'), numField('d', 'By'), numField('e', 'Cx'), numField('f', 'Cy')],
    defaults: { a: '0', b: '0', c: '6', d: '0', e: '0', f: '8' },
    compute: (v) => {
      const ax = n(v.a), ay = n(v.b), bx = n(v.c), by = n(v.d), cx = n(v.e), cy = n(v.f)
      const aLen = Math.sqrt((cx - bx) ** 2 + (cy - by) ** 2)
      const bLen = Math.sqrt((cx - ax) ** 2 + (cy - ay) ** 2)
      const cLen = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2)
      const perimeter = aLen + bLen + cLen
      if (perimeter === 0) return { result: 'Degenerate triangle', label: 'Error' }
      const ix = (aLen * ax + bLen * bx + cLen * cx) / perimeter
      const iy = (aLen * ay + bLen * by + cLen * cy) / perimeter
      return { result: '(' + ix.toFixed(4) + ', ' + iy.toFixed(4) + ')', label: 'Incenter', steps: [step('Result:', 'I = (' + ix.toFixed(4) + ', ' + iy.toFixed(4) + ')')] }
    },
    formula: 'I = (aA + bB + cC) / (a + b + c)',
    description: 'Calculate the incenter of a triangle (center of inscribed circle).',
    interpretation: 'The incenter is the intersection of the angle bisectors of the triangle.'
}

export default calcDef
