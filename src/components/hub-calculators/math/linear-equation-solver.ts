import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Coefficient a'), numField('b', 'Constant b')],
    defaults: { a: '2', b: '-6' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (a === 0) return { result: b === 0 ? 'All real numbers' : 'No solution', label: 'Error' }
      const x = -b / a
      return { result: x.toFixed(4), label: 'Solution', steps: [step('Equation:', '' + a + 'x + ' + b + ' = 0'), step('Solve:', 'x = -' + b + ' / ' + a), step('x:', '' + x.toFixed(4))],
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ] }
    },
    formula: 'ax + b = 0 -> x = -b/a',
    description: 'Solve linear equations of the form ax + b = 0.',
    interpretation: 'The solution of the linear equation.',
    presets: [
      { label: 'Simple', values: { a: '2', b: '4' } },
      { label: 'Negative Slope', values: { a: '-3', b: '6' } }
    ]
}

export default calcDef
