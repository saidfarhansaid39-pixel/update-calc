import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 20, '0-20 integer') }),
    fields: [numField('n', 'n (0-20)', { min: 0, max: 20, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => { const nVal = Math.round(n(v.n)); const c = Math.round(fact(2 * nVal) / (fact(nVal + 1) * fact(nVal))); return { result: c, label: 'C?', steps: [step('n', '' + nVal), step('Catalan number', '' + c)] } },
    formula: 'C? = (2n)! / ((n+1)! n!).',
    description: 'Calculate the nth Catalan number.',
    interpretation: 'Catalan numbers count balanced parentheses, binary trees, and more.'
}

export default calcDef
