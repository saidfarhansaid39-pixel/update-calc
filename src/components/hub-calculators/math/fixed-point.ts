import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), iter: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 50, '1-50 integer') }),
    fields: [numField('x0', 'Initial guess'), numField('iter', 'Iterations', { min: 1, max: 50, step: '1' })],
    defaults: { x0: '1.5', iter: '10' },
    compute: (v) => {
      let x = n(v.x0), iters = Math.round(n(v.iter)); const steps: { label: string; value: string }[] = [step('Initial', `x0 = ${x.toFixed(6)}`)]
      for (let i = 0; i < iters; i++) { x = Math.sqrt(2 + x) - 0.5; steps.push(step(`Iter ${i + 1}`, `x = ${x.toFixed(6)}`)) }
      return { result: x.toFixed(10), label: 'Fixed point', steps }
    },
    formula: 'x??1 = g(x?). Example: g(x) = v(2+x) - 0.5.',
    description: 'Fixed point iteration method.',
    interpretation: 'Converges to a fixed point where x = g(x).'
}

export default calcDef
