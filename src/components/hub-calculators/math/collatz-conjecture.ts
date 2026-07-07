import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1, 'Integer >= 1') }),
    fields: [numField('n', 'Starting number', { min: 1, step: '1' })],
    defaults: { n: '27' },
    compute: (v) => {
      let val = Math.round(n(v.n)); const seq = [val]; let stepsCount = 0
      while (val !== 1 && stepsCount < 1000) { val = val % 2 === 0 ? val / 2 : 3 * val + 1; seq.push(val); stepsCount++ }
      return { result: '' + stepsCount, label: 'Steps to 1', steps: [step('Start', '' + Math.round(n(v.n))), step('Sequence', seq.slice(0, 20).join(' -> ') + (seq.length > 20 ? '...' : '')), step('Steps', '' + stepsCount)] }
    },
    formula: 'If n is even: n/2. If n is odd: 3n+1. Repeat until 1.',
    description: 'Calculate the Collatz (3n+1) sequence from a starting number.',
    interpretation: 'The Collatz conjecture states every positive integer eventually reaches 1.'
}

export default calcDef
