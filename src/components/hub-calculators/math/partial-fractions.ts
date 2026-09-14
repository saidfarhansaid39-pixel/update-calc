import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), c: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [numField('a', 'Numerator coeff a'), numField('b', 'Factor root r1'), numField('c', 'Factor root r2')],
    defaults: { a: '3', b: '1', c: '2' },
    compute: (v) => {
      const A = n(v.a), r1 = n(v.b), r2 = n(v.b) !== n(v.c) ? n(v.c) : n(v.b) + 1
      if (r1 === r2) return { result: 'Repeated roots - use A/(x-r) + B/(x-r)2', label: 'Note', steps: [step('Partial fraction:', A + '/((x-' + r1 + ')(x-' + r2 + '))')] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]}
      const aVal = A / (r1 - r2), bVal = -A / (r1 - r2)
      return { result: aVal.toFixed(4) + '/(x-' + r1.toFixed(4) + ') + ' + bVal.toFixed(4) + '/(x-' + r2.toFixed(4) + ')', label: 'Partial fractions', steps: [step('A:', '' + aVal.toFixed(4)), step('B:', '' + bVal.toFixed(4))] }
    },
    formula: 'A/((x-r1)(x-r2)) = a/(x-r1) + b/(x-r2)',
    description: 'Decompose a rational function into partial fractions.',
    interpretation: 'The partial fraction decomposition of the given rational expression.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
