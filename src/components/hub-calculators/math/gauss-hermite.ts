import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2, 'Must be >= 2') }),
    fields: [numField('a', 'Number of points n', { min: 2, step: '1' })],
    defaults: { a: '3' },
    compute: (v) => {
      const n = Math.max(2, Math.round(Number(v.a)))
      const nodes = [-Math.sqrt(3 / 2), 0, Math.sqrt(3 / 2)].slice(0, n)
      const weights = [Math.sqrt(Math.PI) / 3, Math.sqrt(Math.PI) * 4 / 3 / 2, 0].slice(0, n)
      weights[Math.floor(n / 2)] = Math.sqrt(Math.PI) * 2 / 3
      let sum = 0; const pts: string[] = []
      for (let i = 0; i < n; i++) { pts.push('x' + (i + 1) + '=' + nodes[i].toFixed(4)); sum += (weights[i] || 0) * Math.cos(nodes[i]) }
      return { result: sum.toFixed(6), label: 'Gauss-Hermite approx', steps: [step('Nodes:', pts.join('; ')), step('Approx integral:', '' + sum.toFixed(6))] }
    },
    formula: 'int_-inf^inf f(x)e-x2 dx approx sum wi f(xi)',
    description: 'Gauss-Hermite quadrature approximation.',
    interpretation: 'The approximate integral over (-inf, inf) using Hermite nodes.'
}

export default calcDef
