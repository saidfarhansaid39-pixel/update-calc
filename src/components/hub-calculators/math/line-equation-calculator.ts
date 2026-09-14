import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, num4Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num4Schema,
    fields: [numField('a', 'x1'), numField('b', 'y1'), numField('c', 'x2'), numField('d', 'y2')],
    defaults: { a: '1', b: '2', c: '4', d: '8' },
    compute: (v) => {
      const x1 = n(v.a), y1 = n(v.b), x2 = n(v.c), y2 = n(v.d)
      const m = x2 !== x1 ? (y2 - y1) / (x2 - x1) : NaN
      const b = isNaN(m) ? NaN : y1 - m * x1
      return { result: isNaN(m) ? 'x = ' + x1 : m === 0 ? 'y = ' + b : 'y = ' + m + 'x + ' + b, label: 'Line Equation', steps: [step('Slope:', 'm = (' + y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ') = ' + (isNaN(m) ? 'undefined' : m.toFixed(4))), step('Y-intercept:', 'b = ' + y1 + ' - ' + (isNaN(m) ? '?' : m.toFixed(4)) + ' x ' + x1 + ' = ' + (isNaN(b) ? '?' : b.toFixed(4)))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'y = mx + b (two-point form)',
    description: 'Find the equation of a line through two points.',
    interpretation: 'The line equation in slope-intercept form through the two given points.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
