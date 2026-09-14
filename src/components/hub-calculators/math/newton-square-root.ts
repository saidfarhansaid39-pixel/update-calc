import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Must be >= 0') }),
    fields: [numField('a', 'Number')],
    defaults: { a: '144' },
    compute: (v) => {
      const a = n(v.a)
      let guess = a / 2
      for (let i = 0; i < 20; i++) guess = (guess + a / guess) / 2
      return { result: guess, label: 'sqrt(x)', steps: [step('Method:', 'Newton-Raphson sqrt(' + a + ')'), step('Result:', '' + guess.toFixed(6))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'x_{n+1} = (x_n + a/x_n) / 2',
    description: 'Calculate square root using Newton-Raphson method.',
    interpretation: 'The square root of the input using iterative approximation.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
