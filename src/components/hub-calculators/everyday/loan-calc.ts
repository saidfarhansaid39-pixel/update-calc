import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loanAmount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), termMonths: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  defaults: { loanAmount: '25000', rate: '6.5', termMonths: '60' },
  presets: [
    { label: 'Auto Loan ($30K/5yr)', values: { loanAmount: '30000', rate: '6.5', termMonths: '60' } },
    { label: 'Personal Loan ($10K/3yr)', values: { loanAmount: '10000', rate: '10', termMonths: '36' } },
    { label: 'Mortgage ($350K/30yr)', values: { loanAmount: '350000', rate: '7', termMonths: '360' } },
  ],
  fields: [
    { name: 'loanAmount', label: 'Loan Amount ($)', type: 'number', min: 100, step: '1000' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', min: 0.1, step: '0.25' },
    { name: 'termMonths', label: 'Loan Term (months)', type: 'number', min: 1, step: '12' },
  ],
  compute: (v) => {
    const P = parseFloat(v.loanAmount)||0; const R = parseFloat(v.rate)||0; const N = parseFloat(v.termMonths)||1
    const r = R / 100 / 12
    const n = N
    const payment = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = payment * n
    const totalInterest = totalPaid - P
    return { result: payment, label: 'Monthly Payment', unit: '$', steps: [
      { label: '1. Monthly Rate', value: `${R}% ÷ 12 = ${(r * 100).toFixed(4)}% (${r.toFixed(6)} decimal)` },
      { label: '2. Total Payments', value: `${N} months` },
      { label: '3. Amortization Formula', value: `M = $${P.toFixed(0)} × [${r.toFixed(6)}(1+${r.toFixed(6)})^${n}] / [(1+${r.toFixed(6)})^${n} - 1]` },
      { label: '4. Monthly Payment', value: `$${payment.toFixed(2)}` },
      { label: '5. Total Paid', value: `$${payment.toFixed(2)} × ${n} = $${totalPaid.toFixed(2)}` },
      { label: '6. Total Interest', value: `$${totalPaid.toFixed(2)} - $${P.toFixed(0)} = $${totalInterest.toFixed(2)}` },
    ] ,
    extras: [
      { label: 'APR vs Interest Rate', value: 'APR includes fees + interest and is always higher. A 6% rate with 1% fees = ~6.5% APR. Compare APR, not rate, between lenders.' },
      { label: 'Shorter Term Savings', value: 'A $30K auto loan at 6%: 36mo = $913/mo, $2,856 interest. 60mo = $580/mo, $4,799 interest. Saving $1,943 by choosing 36mo.' },
      { label: 'Extra Payments', value: 'Paying even $50 extra per month on a $350K/7%/30yr mortgage saves $48,000 in interest and pays off 5 years early.' },
      { label: 'Credit Score Impact', value: 'A 760+ credit score gets rates 1-3% lower than a 620 score. On a $30K auto loan, that\'s $3,000-9,000 in interest savings over 5 years.' },
      { label: 'Refinance Consideration', value: 'Refinance when rates drop 1-2% below your current rate. Closing costs (2-5% of loan) must be recovered through monthly savings.' },
      { label: 'Prepayment Penalties', value: 'Some loans charge 1-2% of remaining balance if you pay early. Always check for prepayment penalties before signing.' },
      { label: 'Simple vs Compound', value: 'Personal loans are typically simple interest (interest on principal only). Mortgages use amortized compounding (more interest early).' },
      { label: 'Debt-to-Income Ratio', value: 'Lenders want DTI below 43%. Monthly payment from this calculator counts toward your DTI. Max housing payment: 28% of gross income.' },
    ]}
  },
  description: 'Calculate monthly loan payments, total interest, and total cost for any amortizing loan (auto, personal, mortgage). Includes amortization formula breakdown and strategies.',
  formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1] where r = monthly rate (annual/12), n = total months. Total Interest = M×n − P. Total Paid = M × n.',
  interpretation: 'Shorter terms mean higher payments but significantly less total interest. A $10,000 loan at 6%: 36 months = $304/mo, $948 interest. 60 months = $193/mo, $1,598 interest. Extra payments directly reduce principal and save substantial interest over the loan life.'
}

export default calcDef
