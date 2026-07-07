import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ n: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && Number.isInteger(Number(v)) && Number(v) <= 20, '0-20 integer') }),
    fields: [numField('n', 'n (0-20)', { min: 0, max: 20, step: '1' })],
    defaults: { n: '5' },
    compute: (v) => { const nVal = Math.round(n(v.n)); let d = 1; for (let i = 2; i <= nVal; i++) d = i * d + (i % 2 === 0 ? 1 : -1); return { result: d, label: '!n', steps: [step('Derangements', '' + d)] } },
    formula: '!n = n � !(n-1) + (-1)n. Or !n = round(n!/e).',
    description: 'Calculate the number of derangements of n items.',
    interpretation: 'Number of permutations where no element appears in its original position.'
}

export default calcDef
