import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 2, 'Must be >= 2') }),
    fields: [numField('a', 'Number of points n', { min: 2, step: '1' })],
    defaults: { a: '3' },
    compute: (v) => {
      const n = Math.max(2, Math.round(Number(v.a)))
      const nodes = [0.4157745568, 2.2942803603, 6.2899450829].slice(0, n)
      const weights = [0.7110930099, 0.2785177336, 0.0103892565].slice(0, n)
      let sum = 0; const pts: string[] = []
      for (let i = 0; i < n; i++) { pts.push('x' + (i + 1) + '=' + nodes[i].toFixed(4) + ', w=' + weights[i].toFixed(4)); sum += weights[i] * Math.cos(nodes[i]) }
      return { result: sum.toFixed(6), label: 'Gauss-Laguerre approx', steps: [step('Nodes/Weights:', pts.join('; ')), step('Approx integral:', '' + sum.toFixed(6))] }
    },
    formula: 'int_0^inf f(x)e-x dx approx sum wi f(xi)',
    description: 'Gauss-Laguerre quadrature approximation.',
    interpretation: 'The approximate integral over [0, inf) using Laguerre nodes.'
}

export default calcDef
