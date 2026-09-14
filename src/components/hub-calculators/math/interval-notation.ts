import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Lower bound'), numField('b', 'Upper bound')],
    defaults: { a: '0', b: '10' },
    compute: (v) => {
      const lo = n(v.a), hi = n(v.b)
      return { result: '[' + lo + ', ' + hi + ']', label: 'Interval Notation', steps: [step('Inequality:', '' + lo + ' <= x <= ' + hi), step('Interval:', '[' + lo + ', ' + hi + ']')] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'Interval [a, b]',
    description: 'Convert between inequality and interval notation.',
    interpretation: 'The set of x values satisfying the inequality.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
