import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), iter: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 50, '1-50 integer') }),
    fields: [numField('x0', 'x0'), numField('x1', 'x1'), numField('iter', 'Iterations', { min: 1, max: 50, step: '1' })],
    defaults: { x0: '0', x1: '2', iter: '5' },
    compute: (v) => {
      let x0 = n(v.x0), x1 = n(v.x1), iters = Math.round(n(v.iter)); const steps: { label: string; value: string }[] = []
      for (let i = 0; i < iters; i++) { const f0 = x0 * x0 - 2, f1 = x1 * x1 - 2; const df = (f1 - f0) / (x1 - x0); if (Math.abs(df) < 1e-15) break; const xn = x1 - f1 / df; steps.push(step(`Iter ${i + 1}`, `x = ${xn.toFixed(6)}`)); x0 = x1; x1 = xn }
      return { result: x1.toFixed(10), label: 'Root (v2)', steps }
    },
    formula: 'x??1 = x? - f(x?)(x? - x??1)/(f(x?) - f(x??1)).',
    description: 'Secant method for root finding (no derivative needed).',
    interpretation: 'Approximate root using secant line approximation.'
}

export default calcDef
