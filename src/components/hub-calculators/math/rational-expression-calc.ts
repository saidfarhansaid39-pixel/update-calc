import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) !== 0, 'Must be != 0') }),
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator (?0)')],
    defaults: { a: '6', b: '8' },
    compute: (v) => { const a = n(v.a), b = n(v.b); const g = (x: number, y: number): number => y === 0 ? Math.abs(x) : g(y, x % y); const gv = g(Math.round(a), Math.round(b)); const sA = a / gv, sB = b / gv; return { result: `${a}/${b} = ${sA}/${sB} = ${(a / b).toFixed(4)}`, label: 'Simplified', steps: [step('Original', `${a}/${b}`), step('GCD', '' + gv), step('Simplified', `${sA}/${sB}`), step('Decimal', (a / b).toFixed(4))] ,
    extras: [
      { label: "Solution Methods", value: "Can be solved via factoring, formula, or graphical methods." },
      { label: "Discriminant Insight", value: "The discriminant reveals the number and type of solutions." },
      { label: "Graphical Meaning", value: "Solutions correspond to x-intercepts on the graph." },
      { label: "Checking Solutions", value: "Substitute results back into the original equation to verify." },
      { label: "Real vs Complex", value: "Real solutions appear when discriminant ≥ 0; otherwise complex." }
    ]} },
    formula: 'Simplify a/b by dividing numerator and denominator by GCD.',
    description: 'Simplify a rational expression.',
    interpretation: 'Simplified rational number in lowest terms.',
    presets: [
      { label: 'Default', values: {  } }
    ]
}

export default calcDef
