import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), y1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('x0', 'x0'), numField('y0', 'y0'), numField('x1', 'x1'), numField('y1', 'y1'), numField('x', 'Target x')],
    defaults: { x0: '0', y0: '0', x1: '10', y1: '100', x: '5' },
    compute: (v) => {
      const x0 = n(v.x0), y0 = n(v.y0), x1 = n(v.x1), y1 = n(v.y1), x = n(v.x)
      const L0 = (x - x1) / (x0 - x1); const L1 = (x - x0) / (x1 - x0); const y = y0 * L0 + y1 * L1
      return { result: y.toFixed(4), label: 'P(x)', steps: [step('L0(x)', L0.toFixed(4)), step('L1(x)', L1.toFixed(4)), step('P(x) = y0L0 + y1L1', y.toFixed(4))] }
    },
    formula: 'P(x) = S y? L?(x) where L?(x) = ? (x-x?)/(x?-x?).',
    description: 'Lagrange polynomial interpolation for 2 points.',
    interpretation: 'Interpolated value using Lagrange basis polynomials.'
}

export default calcDef
