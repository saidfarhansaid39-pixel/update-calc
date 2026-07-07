import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ loanAmount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), termMonths: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'loanAmount', label: 'Loan Amount ($)', type: 'number', min: 100, step: '1000' },
    { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', min: 0.1, step: '0.25' },
    { name: 'termMonths', label: 'Loan Term (months)', type: 'number', min: 1, step: '12' },
  ],
  compute: (v) => {
    const r = v.rate / 100 / 12
    const n = v.termMonths
    const payment = r === 0 ? v.loanAmount / n : v.loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = payment * n
    const totalInterest = totalPaid - v.loanAmount
    return { result: payment, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Monthly Payment', value: `$${payment.toFixed(2)}` }, { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` }, { label: 'Total Paid', value: `$${totalPaid.toFixed(2)}` }] }
  },
  description: 'Calculate monthly loan payments, total interest, and total cost for any amortizing loan (auto, personal, mortgage).',
  formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
  interpretation: 'Shorter terms mean higher payments but less total interest. A $10,000 loan at 6% for 36 months: $304/month, $948 interest. For 60 months: $193/month, $1,598 interest.'
}

export default calcDef
