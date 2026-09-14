import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Number a'), numField('b', 'Number b')],
    defaults: { a: '48', b: '18' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const result = gcd(a, b)
      return { result, label: 'GCD(' + a + ', ' + b + ')', steps: [step('Euclidean:', 'gcd(' + a + ', ' + b + ')'), step('Result:', '' + result)] ,
    extras: [
      { label: "Mathematical Significance", value: "Fundamental concept in number theory and discrete mathematics." },
      { label: "Computational Note", value: "Large inputs may require optimized algorithms for performance." },
      { label: "Historical Context", value: "Studied by mathematicians across centuries for its unique properties." },
      { label: "Related Sequences", value: "Related to other integer sequences and special numbers." },
      { label: "Pattern Recognition", value: "Observe recurring patterns and relationships between values." }
    ]}
    },
    formula: 'gcd(a, b) via Euclidean algorithm',
    description: 'Calculate the greatest common divisor of two numbers.',
    interpretation: 'The largest positive integer that divides both numbers.',
    presets: [
      { label: 'Coprime', values: { a: '7', b: '11' } },
      { label: 'Common', values: { a: '12', b: '18' } },
      { label: 'Multiple', values: { a: '24', b: '36' } }
    ]
}

export default calcDef
