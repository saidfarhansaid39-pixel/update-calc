import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient a'), numField('b', 'Coefficient b'), numField('x', 'Value of x')],
    defaults: { a: '2', b: '3', x: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), x = n(v.x)
      const result = a * x + b
      return { result, label: 'f(' + x + ')', steps: [step('Function:', 'f(x) = ' + a + 'x + ' + b), step('Substitute x=', '' + x), step('Result:', '' + a + ' x ' + x + ' + ' + b + ' = ' + result)] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'f(x) = ax + b',
    description: 'Evaluate a linear function f(x) = ax + b at a given x.',
    interpretation: 'The value of the function when x equals the given value.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
