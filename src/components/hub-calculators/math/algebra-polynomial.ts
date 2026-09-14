import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Coefficient an'), numField('b', 'Coefficient a0'), numField('c', 'Value x (for evaluation)')],
    defaults: { a: '3', b: '2', c: '4' },
    compute: (v) => {
      const an = n(v.a), a0 = n(v.b), x = n(v.c)
      const result = an * x + a0
      return { result, label: 'P(' + x + ')', steps: [step('Polynomial:', 'P(x) = ' + an + 'x + ' + a0), step('Evaluate at x=' + x + ':', '' + result)] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'P(x) = an*x^n + ... + a0',
    description: 'Evaluate or analyze a polynomial expression.',
    interpretation: 'The value of the polynomial at the given point.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
