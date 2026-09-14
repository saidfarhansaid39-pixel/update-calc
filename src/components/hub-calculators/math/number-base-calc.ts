import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && Number.isInteger(Number(v)), 'Must be an integer') }),
    fields: [numField('a', 'Decimal number', { min: 0, step: '1' })],
    defaults: { a: '255' },
    compute: (v) => {
      const num = Math.round(n(v.a))
      return { result: 'bin=' + num.toString(2) + ', oct=' + num.toString(8) + ', hex=' + num.toString(16).toUpperCase(), label: 'Conversions', steps: [step('Decimal:', '' + num), step('Binary:', num.toString(2)), step('Octal:', num.toString(8)), step('Hexadecimal:', num.toString(16).toUpperCase())] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Number base conversion',
    description: 'Convert a number between decimal, binary, octal, and hexadecimal.',
    interpretation: 'The number represented in different bases.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
