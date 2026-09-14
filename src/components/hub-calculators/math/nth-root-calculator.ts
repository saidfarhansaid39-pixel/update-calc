import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Number'), numField('b', 'Root (n)')],
    defaults: { a: '81', b: '4' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Undefined (0th root)', label: 'Error' }
      const result = Math.pow(a, 1 / b)
      return { result, label: 'nth root', steps: [step('Formula:', '' + b + 'th root of ' + a + ' = ' + a + '^(1/' + b + ')'), step('Result:', '' + result.toFixed(6))],
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ] }
    },
    formula: 'nth-root(x) = x^(1/n)',
    description: 'Calculate the nth root of a number.',
    interpretation: 'The number that when raised to the nth power equals the input.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
