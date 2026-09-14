import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Value x')],
    defaults: { a: '-5' },
    compute: (v) => {
      const a = n(v.a)
      return { result: Math.abs(a), label: '|x|', steps: [step('Input:', 'x = ' + a), step('Result:', '|' + a + '| = ' + Math.abs(a))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: '|x| = x if x >= 0, -x if x < 0',
    description: 'Calculate the absolute value of a number.',
    interpretation: 'The distance of the number from zero on the number line.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
