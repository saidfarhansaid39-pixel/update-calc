import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'a in (ax + b)'), numField('b', 'b in (ax + b)'), numField('c', 'c in (cx + d)'), numField('d', 'd in (cx + d)')],
    defaults: { a: '2', b: '3', c: '4', d: '5' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const x2 = a * c, x = a * d + b * c, constVal = b * d
      let result = ''; if (x2 !== 0) result += (x2 === 1 ? '' : x2 === -1 ? '-' : x2) + 'x^2'
      if (x !== 0) result += (x > 0 && result ? ' + ' : result ? ' - ' : '') + (Math.abs(x) === 1 ? '' : Math.abs(x)) + 'x'
      if (constVal !== 0) result += (constVal > 0 && result ? ' + ' : result ? ' - ' : '') + Math.abs(constVal)
      return { result: result || '0', label: 'Product', steps: [step('First', '' + a + 'x � ' + c + 'x = ' + x2 + 'x^2'), step('Outer+Inner', '(' + a + 'x � ' + d + ') + (' + b + ' � ' + c + 'x) = ' + x + 'x'), step('Last', '' + b + ' � ' + d + ' = ' + constVal), step('Result', result || '0')] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: '(ax + b)(cx + d) = acx^2 + (ad + bc)x + bd.',
    description: 'Multiply two linear binomials.',
    interpretation: 'The expanded polynomial product of the two binomials.',
    presets: [
      { label: '15% tip $50', values: { a: '50', b: '15' } },
      { label: '20% tip $75', values: { a: '75', b: '20' } }
    ]
}

export default calcDef
