import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Number of points n')],
    defaults: { a: '5' },
    compute: (v) => {
      const n = Math.max(2, Math.round(Number(v.a)))
      let sum = 0; const pts: string[] = []
      for (let i = 1; i <= n; i++) { const xi = Math.cos((2 * i - 1) * Math.PI / (2 * n)); const wi = Math.PI / n; sum += wi * Math.sqrt(1 - xi * xi); pts.push('x' + i + '=' + xi.toFixed(4)) }
      return { result: sum.toFixed(6), label: 'Gauss-Chebyshev approx', steps: [step('Nodes:', pts.join(', ')), step('Approx integral:', '' + sum.toFixed(6))] }
    },
    formula: 'int_-1^1 f(x)/sqrt(1-x2) dx approx sum wi f(xi)',
    description: 'Gauss-Chebyshev quadrature approximation.',
    interpretation: 'The approximate integral using Chebyshev nodes and weights.'
}

export default calcDef
