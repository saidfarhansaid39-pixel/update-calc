import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), d: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Numerator a'), numField('b', 'Denominator b'), numField('c', 'Numerator c'), numField('d', 'Denominator d')],
    defaults: { a: '1', b: '2', c: '1', d: '3' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), d = n(v.d)
      const num = a * d + c * b, den = b * d
      return { result: (num / den).toFixed(4), label: 'Result', steps: [step('Cross multiply:', '(' + a + ' x ' + d + ' + ' + c + ' x ' + b + ') / (' + b + ' x ' + d + ')'), step('Result:', num + '/' + den + ' = ' + (num / den).toFixed(4))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
    },
    formula: 'a/b + c/d = (ad + bc) / bd',
    description: 'Add two rational expressions.',
    interpretation: 'The sum of the two rational numbers.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
