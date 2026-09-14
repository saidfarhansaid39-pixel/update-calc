import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '1', b: '2', c: '4', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const slope = x2 !== x1 ? (y2 - y1) / (x2 - x1) : NaN
      return { result: isNaN(slope) ? 'Undefined (vertical)' : slope, label: 'Slope (m)', steps: [step('Formula:', 'm = (' + y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ')'), step('Result:', 'm = ' + (isNaN(slope) ? 'undefined (vertical line)' : slope.toFixed(4)))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'm = (y2 - y1) / (x2 - x1)',
    description: 'Calculate the slope of a line through two points.',
    interpretation: 'The slope measures the steepness and direction of the line.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
