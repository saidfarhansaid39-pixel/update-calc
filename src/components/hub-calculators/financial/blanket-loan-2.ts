import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalLoan: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), numProperties: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'), avgRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), term: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 40, '1-40') }),
  fields: [{ name: 'totalLoan', label: 'Total Loan Amount ($)', type: 'number', min: 0, step: '1000' }, { name: 'numProperties', label: 'Number of Properties', type: 'number', min: 1, step: '1' }, { name: 'avgRate', label: 'Average Interest Rate (%)', type: 'number', min: 0, max: 30, step: '0.01' }, { name: 'term', label: 'Loan Term (years)', type: 'number', min: 1, max: 40, step: '1' }],
  compute: (v) => { const loan = parseFloat(v.totalLoan) || 0; const props = parseInt(v.numProperties) || 1; const r = parseFloat(v.avgRate) || 0; const t = parseInt(v.term) || 1; const mr = r / 100 / 12; const np = t * 12; let mp = 0; if (mr > 0 && np > 0) { const f = Math.pow(1 + mr, np); mp = loan * (mr * f) / (f - 1) } else if (np > 0) mp = loan / np; const total = mp * np; return { result: mp, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Total Loan', value: `$${loan.toFixed(2)}` }, { label: 'Properties', value: `${props}` }, { label: 'Monthly Payment', value: `$${mp.toFixed(2)}` }, { label: 'Total Cost', value: `$${total.toFixed(2)}` }] } },
  description: 'A blanket loan is a single mortgage that covers multiple properties. Real estate investors use blanket loans to finance portfolios with one loan rather than separate mortgages.',
  formula: 'M = P × (r(1+r)^n) / ((1+r)^n - 1) applied to the blanket loan covering all properties',
  interpretation: 'Blanket loans simplify portfolio financing with one payment. The per-property cost can be calculated by dividing total payment by the number of properties.'
}

export default calcDef
