import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Slope (m)'), numField('b', 'Y-Intercept (b)')],
    defaults: { a: '2', b: '3' },
    compute: (v) => {
      const m = n(v.a), b = n(v.b)
      return { result: 'y = ' + m + 'x + ' + b, label: 'Equation', steps: [step('Form:', 'y = mx + b'), step('Result:', 'y = ' + m + 'x + ' + b)] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'y = mx + b',
    description: 'Generate the slope-intercept form of a line.',
    interpretation: 'The line equation in y = mx + b form, where m is slope and b is y-intercept.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
