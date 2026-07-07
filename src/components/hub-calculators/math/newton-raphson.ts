import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), iter: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 100, '1-100 integer') }),
    fields: [numField('x0', 'Initial guess x0'), numField('iter', 'Iterations', { min: 1, max: 100, step: '1' })],
    defaults: { x0: '2', iter: '5' },
    compute: (v) => {
      let x = n(v.x0), iters = Math.round(n(v.iter)); const steps: { label: string; value: string }[] = [step('Initial', `x0 = ${x.toFixed(6)}`)]
      for (let i = 0; i < iters; i++) { const f = x * x - 2; const df = 2 * x; if (Math.abs(df) < 1e-15) break; const xn = x - f / df; steps.push(step(`Iter ${i + 1}`, `x = ${xn.toFixed(6)}`)); x = xn }
      return { result: x.toFixed(10), label: 'Root (v2)', steps }
    },
    formula: 'x??1 = x? - f(x?)/f\'(x?). Example: f(x) = x� - 2.',
    description: 'Newton-Raphson method for finding roots. Example finds v2.',
    interpretation: 'Approximate root of f(x) = x� - 2 (square root of 2).'
}

export default calcDef
