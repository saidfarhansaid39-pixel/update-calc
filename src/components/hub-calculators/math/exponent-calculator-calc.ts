import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Base'), numField('b', 'Exponent')],
    defaults: { a: '2', b: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      const result = Math.pow(a, b)
      return { result: Math.abs(result) > 1e15 && b > 0 ? 'Very large' : result, label: 'Result', steps: [step('Exponentiation:', '' + a + '^' + b), step('Result:', '' + result)] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'a^b',
    description: 'Calculate a number raised to a power.',
    interpretation: 'The base raised to the power of the exponent.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
