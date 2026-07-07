import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cpCarPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cpDownPayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cpTradeIn: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cpLoanTerm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cpApr: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cpSalesTax: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'cpCarPrice', label: 'Car Price ($)', type: 'number', min: 1000, step: '1000' },
    { name: 'cpDownPayment', label: 'Down Payment ($)', type: 'number', min: 0, step: '500' },
    { name: 'cpTradeIn', label: 'Trade-In Value ($)', type: 'number', min: 0, step: '500' },
    { name: 'cpLoanTerm', label: 'Loan Term (months)', type: 'number', min: 12, max: 84, step: '12' },
    { name: 'cpApr', label: 'APR (%)', type: 'number', min: 0, max: 30, step: '0.5' },
    { name: 'cpSalesTax', label: 'Sales Tax Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' },
  ],
  compute: (v) => {
    const taxAmount = (v.cpCarPrice - v.cpTradeIn) * (v.cpSalesTax / 100)
    const loanAmount = v.cpCarPrice - v.cpDownPayment - v.cpTradeIn + taxAmount
    const r = v.cpApr / 100 / 12
    const n = v.cpLoanTerm
    let monthlyPayment = 0
    if (r === 0) monthlyPayment = loanAmount / n
    else monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = monthlyPayment * n
    const totalInterest = totalPaid - loanAmount
    return { result: monthlyPayment, label: 'Monthly Payment', unit: '$', steps: [{ label: 'Loan Amount', value: '$' + loanAmount.toFixed(2) }, { label: 'APR', value: v.cpApr + '%' }, { label: 'Term', value: n + ' months' }, { label: 'Monthly Payment', value: '$' + monthlyPayment.toFixed(2) }, { label: 'Total Interest', value: '$' + totalInterest.toFixed(2) }, { label: 'Total Cost', value: '$' + totalPaid.toFixed(2) }] }
  },
  description: 'Calculate monthly car payments including down payment, trade-in, APR, sales tax, and loan term. See total interest and full cost.',
  formula: 'Monthly = P x [r(1+r)^n] / [(1+r)^n - 1] where P = Price - Down - TradeIn + Tax | Total Interest = TotalPaid - P',
  interpretation: '20/4/10 rule: 20% down, 4-year term, payment <= 10% income. New car average: $48,000 at 7% for 60 months = ~$950/month. Used car average: $27,000 at 8% for 48 months = ~$660/month.'
}

export default calcDef
