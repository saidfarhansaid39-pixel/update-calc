import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1, 'Must be >= 1') }),
    fields: [numField('a', 'Value'), numField('b', 'Significant Figures')],
    defaults: { a: '3.14159', b: '3' },
    compute: (v) => {
      const a = n(v.a), b = Math.round(n(v.b))
      const result = parseFloat(a.toPrecision(b))
      return { result, label: 'Rounded to ' + b + ' sig figs', steps: [step('Original:', '' + a), step('Sig figs:', '' + b), step('Result:', '' + result)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Round to n significant figures',
    description: 'Round a number to a specified number of significant figures.',
    interpretation: 'The number rounded to the given number of significant digits.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
