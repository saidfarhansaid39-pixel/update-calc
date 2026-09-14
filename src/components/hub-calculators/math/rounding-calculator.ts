import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), 'Must be non-negative integer') }),
    fields: [numField('a', 'Value'), numField('b', 'Decimal Places', { min: 0, step: '1' })],
    defaults: { a: '3.14159', b: '2' },
    compute: (v) => {
      const a = n(v.a), b = Math.round(n(v.b))
      const factor = Math.pow(10, b)
      return { result: Math.round(a * factor) / factor, label: 'Rounded to ' + b + ' decimal places', steps: [step('Original:', '' + a), step('Rounding:', 'to ' + b + ' decimal places'), step('Result:', '' + (Math.round(a * factor) / factor).toFixed(b))] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'Round to n decimal places',
    description: 'Round a number to a specified number of decimal places.',
    interpretation: 'The number rounded to the given precision.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
