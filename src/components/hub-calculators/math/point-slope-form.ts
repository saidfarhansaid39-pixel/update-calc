import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num3Schema,
    fields: [numField('a', 'Point x1'), numField('b', 'Point y1'), numField('c', 'Slope (m)')],
    defaults: { a: '2', b: '3', c: '4' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), m = n(v.c)
      return { result: 'y - ' + y1 + ' = ' + m + '(x - ' + x1 + ')', label: 'Point-Slope Form', steps: [step('Form:', 'y - y1 = m(x - x1)'), step('Result:', 'y - ' + y1 + ' = ' + m + '(x - ' + x1 + ')')] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'y - y1 = m(x - x1)',
    description: 'Generate the point-slope form of a line.',
    interpretation: 'The line equation in point-slope form using the given point and slope.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
