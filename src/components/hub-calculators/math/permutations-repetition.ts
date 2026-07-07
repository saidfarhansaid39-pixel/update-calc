import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 1 && Number.isInteger(Number(v)) && Number(v) <= 20, '1-20 integer'), r: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)), '0+ integer') }),
    fields: [numField('n', 'n', { min: 1, max: 20, step: '1' }), numField('r', 'r (chosen)', { min: 0, step: '1' })],
    defaults: { n: '5', r: '3' },
    compute: (v) => { const nVal = Math.round(n(v.n)), r = Math.round(n(v.r)); const p = Math.pow(nVal, r); return { result: p, label: 'n^r', steps: [step('n^r', '' + p)] } },
    formula: 'P = n?.',
    description: 'Calculate permutations with repetition allowed.',
    interpretation: 'Number of ways to arrange r items from n types with repetition.'
}

export default calcDef
