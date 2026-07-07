import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), downPayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rateAnnual: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), loanYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'homePrice', label: 'Home Price ($)', type: 'number', min: 50000, step: '10000' },
    { name: 'downPayment', label: 'Down Payment ($)', type: 'number', min: 0, step: '5000' },
    { name: 'rateAnnual', label: 'Annual Interest Rate (%)', type: 'number', min: 1, step: '0.25' },
    { name: 'loanYears', label: 'Loan Term (years)', type: 'number', min: 5, step: '5' },
  ],
  compute: (v) => { const hp = parseFloat(v.homePrice)||0; const dp = parseFloat(v.downPayment)||0; const r = parseFloat(v.rateAnnual)||0 / 100 / 12; const n = (parseFloat(v.loanYears)||0) * 12; const pv = hp - dp; const m = pv * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); const totalPaid = m * n; const totalInterest = totalPaid - pv; return { result: m, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Loan Amount', value: `$${pv.toFixed(2)}` }, { label: 'Monthly Payment', value: `$${(isNaN(m) ? 0 : m).toFixed(2)}` }, { label: 'Total Interest', value: `$${(isNaN(totalInterest) ? 0 : totalInterest).toFixed(2)}` }, { label: 'Total Paid', value: `$${(isNaN(totalPaid) ? 0 : totalPaid).toFixed(2)}` }] } },
  description: 'Calculate total home buying costs — monthly mortgage payment, total interest, and total payment over the loan term.',
  formula: 'M = P × [r(1+r)^n] / [(1+r)^n − 1] where P = Price − Down, r = monthly rate, n = months',
  interpretation: '20% down avoids PMI. Every 1% rate change affects payment by ~$50-$100 per $100K borrowed. Closing costs add 2-5% of purchase price. Include property tax and insurance in budget.'
}

export default calcDef
