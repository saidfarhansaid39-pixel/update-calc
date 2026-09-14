import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 30, '1-30 integer') }),
    fields: [numField('n', 'Number of disks (1-30)', { min: 1, max: 30, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); const moves = Math.pow(2, nVal) - 1
      return { result: moves, label: 'Minimum moves', steps: [step('Formula', 'Minimum moves = 2^n - 1'), step('Moves', '2^' + nVal + ' - 1 = ' + moves)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'T(n) = 2^n - 1.',
    description: 'Calculate the minimum number of moves to solve the Tower of Hanoi.',
    interpretation: 'The minimum number of moves required to transfer n disks.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
