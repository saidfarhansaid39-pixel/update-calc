import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Must be > 0') }),
    fields: [numField('a', 'Value (x)')],
    defaults: { a: '100' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.log(a), label: 'ln(x)', steps: [step('Formula:', 'ln(' + a + ')'), step('Result:', '' + Math.log(a).toFixed(6))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'ln(x)',
    description: 'Calculate the natural logarithm (base e) of a value.',
    interpretation: 'The exponent to which e must be raised to get the value.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
