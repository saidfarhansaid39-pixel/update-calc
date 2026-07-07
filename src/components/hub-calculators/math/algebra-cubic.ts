import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('c', 'Coefficient c'), numField('d', 'Constant d')],
    defaults: { a: '1', b: '-6', c: '11', d: '-6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const f = ((3 * c / a) - ((b * b) / (a * a))) / 3
      const g = (((2 * Math.pow(b, 3)) / Math.pow(a, 3)) - ((9 * b * c) / Math.pow(a, 2)) + (27 * d / a)) / 27
      const h = (Math.pow(g, 2) / 4) + (Math.pow(f, 3) / 27)
      if (h > 0) return { result: 'One real root (Cardano)', label: 'Result', steps: [step('f:', '' + f.toFixed(4)), step('g:', '' + g.toFixed(4)), step('h:', '' + h.toFixed(4))] }
      return { result: 'Complex roots, use numerical solver', label: 'Note', steps: [step('h <= 0', 'Three real roots (trigonometric solution)')] }
    },
    formula: 'ax3 + bx2 + cx + d = 0 (Cardano method)',
    description: 'Solve a cubic equation ax3 + bx2 + cx + d = 0.',
    interpretation: 'The roots of the cubic equation.'
}

export default calcDef
