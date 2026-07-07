import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= -1000 && Number(v) <= 1000, 'Integer'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= -1000 && Number(v) <= 1000, 'Integer'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= -10000 && Number(v) <= 10000, 'Integer') }),
    fields: [numField('a', 'a (coefficient of x)', { step: '1' }), numField('b', 'b (coefficient of y)', { step: '1' }), numField('c', 'c (constant)', { step: '1' })],
    defaults: { a: '3', b: '5', c: '1' },
    compute: (v) => {
      let a = Math.round(n(v.a)), b = Math.round(n(v.b)), c = Math.round(n(v.c)), a0 = a, b0 = b
      const gcdVal = (x: number, y: number): number => y === 0 ? Math.abs(x) : gcdVal(y, x % y); const g = gcdVal(a, b)
      if (c % g !== 0) return { result: 'No integer solution', label: 'Diophantine', steps: [step('gcd(' + a + ',' + b + ')', '' + g), step(c + ' not divisible by ' + g, 'No integer solutions')] }
      let x0 = 1, x1 = 0; while (b) { const q = Math.floor(a / b); [a, b] = [b, a - q * b]; [x0, x1] = [x1, x0 - q * x1] }
      const y0 = (c / g - (a0 / g) * x0) / (b0 / g) * -1; const xS = x0 * (c / g), yS = y0 * (c / g)
      return { result: `x = ${xS} + ${b0 / g}t, y = ${yS} - ${a0 / g}t`, label: 'General solution', steps: [step('Particular', `x0 = ${xS}, y0 = ${yS}`), step('General', `x = ${xS} + ${b0 / g}t, y = ${yS} - ${a0 / g}t`)] }
    },
    formula: 'ax + by = c. Solvable iff gcd(a,b) | c.',
    description: 'Solve linear Diophantine equations ax + by = c for integer x, y.',
    interpretation: 'General solution: x = x0 + (b/g)t, y = y0 - (a/g)t.'
}

export default calcDef
