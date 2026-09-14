import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: num2Schema,
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator')],
    defaults: { a: '12', b: '18' },
    compute: (v) => {
      const a = n(v.a), b = n(v.b)
      if (b === 0) return { result: 'Division by zero', label: 'Error' }
      const g = gcd(Math.abs(a), Math.abs(b))
      const snum = a / g, sden = b / g
      return { result: snum + '/' + sden, label: 'Simplified', steps: [step('Original:', '' + a + '/' + b), step('GCD:', '' + g), step('Simplified:', snum + '/' + sden)],
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ] }
    },
    formula: 'Simplify a/b = (a/g)/(b/g) where g = gcd(a,b)',
    description: 'Simplify a fraction to lowest terms.',
    interpretation: 'The fraction in its simplest form.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
