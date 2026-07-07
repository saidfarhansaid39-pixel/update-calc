import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 78 && Number.isInteger(Number(v)), 'Must be integer 0-78') }),
    fields: [numField('a', 'Position n', { min: 0, max: 78, step: '1' })],
    defaults: { a: '10' },
    compute: (v) => {
      const fib = Math.round(n(v.a))
      if (fib > 78) return { result: 'Overflow', label: 'Error' }
      let a = 0, b = 1
      for (let i = 0; i < fib; i++) { const t = b; b = a + b; a = t }
      const result = a
      const seq: number[] = [0, 1]
      if (fib <= 20) for (let i = 2; i <= fib; i++) seq.push(seq[i - 1] + seq[i - 2])
      else for (let i = 2; i <= 20; i++) seq.push(seq[i - 1] + seq[i - 2])
      return { result, label: 'F(' + fib + ')', steps: [step('Sequence:', 'F(0)=0, F(1)=1'), step('Formula:', 'F(n) = F(n-1) + F(n-2)'), step('Result:', 'F(' + fib + ') = ' + result)], extras: [{ label: 'Sequence (to 20)', value: fib <= 20 ? seq.join(', ') : seq.join(', ') + '...' }] }
    },
    formula: 'F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)',
    description: 'Calculate the nth Fibonacci number.',
    interpretation: 'The Fibonacci number at the given position in the sequence.'
}

export default calcDef
