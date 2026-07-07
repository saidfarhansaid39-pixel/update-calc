import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 15, '0-15 integer') }),
    fields: [numField('x', 'Expansion point x'), numField('n', 'Terms (0-15)', { min: 0, max: 15, step: '1' })],
    defaults: { x: '1', n: '5' },
    compute: (v) => {
      const x = n(v.x), nVal = Math.round(n(v.n)); const terms: string[] = []; let sum = 0
      for (let k = 0; k <= nVal; k++) { const term = Math.pow(x, k) / fact(k); terms.push(term.toFixed(6)); sum += term }
      return { result: sum.toFixed(6), label: 'e^x approx', steps: [step('Terms', terms.join(', ')), step('Sum', sum.toFixed(6))] }
    },
    formula: 'e^x = S x^k/k! from k=0 to n.',
    description: 'Taylor series expansion of e^x around x=0.',
    interpretation: 'Approximation of e^x using n+1 terms of its Maclaurin series.'
}

export default calcDef
