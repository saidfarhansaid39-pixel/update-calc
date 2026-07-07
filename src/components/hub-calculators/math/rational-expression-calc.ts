import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ a: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number'), b: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) !== 0, 'Must be != 0') }),
    fields: [numField('a', 'Numerator'), numField('b', 'Denominator (?0)')],
    defaults: { a: '6', b: '8' },
    compute: (v) => { const a = n(v.a), b = n(v.b); const g = (x: number, y: number): number => y === 0 ? Math.abs(x) : g(y, x % y); const gv = g(Math.round(a), Math.round(b)); const sA = a / gv, sB = b / gv; return { result: `${a}/${b} = ${sA}/${sB} = ${(a / b).toFixed(4)}`, label: 'Simplified', steps: [step('Original', `${a}/${b}`), step('GCD', '' + gv), step('Simplified', `${sA}/${sB}`), step('Decimal', (a / b).toFixed(4))] } },
    formula: 'Simplify a/b by dividing numerator and denominator by GCD.',
    description: 'Simplify a rational expression.',
    interpretation: 'Simplified rational number in lowest terms.'
}

export default calcDef
