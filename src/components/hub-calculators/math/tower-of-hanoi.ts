import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 30, '1-30 integer') }),
    fields: [numField('n', 'Number of disks (1-30)', { min: 1, max: 30, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const moves = Math.pow(2, nVal) - 1
      return { result: moves, label: 'Minimum moves', steps: [step('Formula', 'Minimum moves = 2^n - 1'), step('Moves', '2^' + nVal + ' - 1 = ' + moves)] }
    },
    formula: 'T(n) = 2^n - 1.',
    description: 'Calculate the minimum number of moves to solve the Tower of Hanoi.',
    interpretation: 'The minimum number of moves required to transfer n disks.'
}

export default calcDef
