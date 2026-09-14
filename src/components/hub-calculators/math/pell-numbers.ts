import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 30, '0-30 integer') }),
    fields: [numField('n', 'n (0-30)', { min: 0, max: 30, step: '1' })],
    defaults: { n: '10' },
    compute: (v) => {
      const nVal = Math.round(n(v.n)); let a = 0, b = 1
      for (let i = 0; i < nVal; i++) { const t = a + 2 * b; a = b; b = t }
      return { result: a, label: 'P' + nVal, steps: [step('Recurrence', 'P(n) = 2P(n-1) + P(n-2)'), step('P(' + nVal + ')', '' + a)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'P0 = 0, P1 = 1, Pn = 2P(n-1) + P(n-2).',
    description: 'Calculate the nth Pell number.',
    interpretation: 'Pell numbers approximate the square root of 2.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
