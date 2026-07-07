import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a (top-left)', { min: 0.01 }), numField('b', 'b = c (off-diag)'), numField('d', 'd (bottom-right)')],
    defaults: { a: '4', b: '2', d: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), d = n(v.d)
      const l11 = Math.sqrt(a), l21 = b / l11, l22 = Math.sqrt(d - l21 * l21)
      if (isNaN(l22)) return { result: 'Matrix not positive definite', label: 'Cholesky', steps: [step('Error', 'Matrix must be symmetric positive definite')] }
      return { result: `L=[[${l11.toFixed(4)},0],[${l21.toFixed(4)},${l22.toFixed(4)}]]`, label: 'Cholesky Factor', steps: [step('L11', l11.toFixed(4)), step('L21', l21.toFixed(4)), step('L22', l22.toFixed(4))] }
    },
    formula: 'A = LL?. L lower triangular with positive diagonal.',
    description: 'Compute Cholesky decomposition of a symmetric positive-definite 2x2 matrix.',
    interpretation: 'Cholesky decomposition is a special case of LU for symmetric PD matrices.'
}

export default calcDef
