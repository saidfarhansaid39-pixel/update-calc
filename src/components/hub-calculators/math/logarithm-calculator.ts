import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Value (x)'), numField('b', 'Base')],
    defaults: { a: '100', b: '10' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (a <= 0 || b <= 0 || b === 1) return { result: 'Invalid input', label: 'Error' }
      const result = Math.log(a) / Math.log(b)
      return { result, label: 'log_' + b + '(' + a + ')', steps: [step('Formula:', 'log_' + b + '(' + a + ') = ln(' + a + ') / ln(' + b + ')'), step('Result:', '' + result.toFixed(6))],
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ] }
    },
    formula: 'log_b(x) = ln(x) / ln(b)',
    description: 'Calculate the logarithm of a value with a specified base.',
    interpretation: 'The exponent to which the base must be raised to get the value.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
