import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ dividend: z.string().min(1), divisor: z.string().min(1) }),
    fields: [numField('dividend', 'Dividend coefficient'), numField('divisor', 'Divisor coefficient')],
    defaults: { dividend: '10', divisor: '3' },
    compute: (v) => { const a = n(v.dividend), b = n(v.divisor); if (b === 0) return { result: 'Undefined', label: 'Division', steps: [] }; const q = Math.floor(a / b), r = a % b; return { result: `${q} R ${r}`, label: 'Quotient & Remainder', steps: [step('Quotient', '' + q), step('Remainder', '' + r)] } },
    formula: 'Dividend = Divisor � Quotient + Remainder.',
    description: 'Divide a polynomial (simplified as integer division with remainder).',
    interpretation: 'Quotient and remainder from division.'
}

export default calcDef
