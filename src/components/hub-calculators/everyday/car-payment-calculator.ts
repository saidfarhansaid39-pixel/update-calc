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
  defaults: { cpCarPrice: '35000', cpDownPayment: '7000', cpTradeIn: '0', cpLoanTerm: '60', cpApr: '6.5', cpSalesTax: '6' },
  presets: [
    { label: 'New SUV', values: { cpCarPrice: '48000', cpDownPayment: '9600', cpTradeIn: '5000', cpLoanTerm: '60', cpApr: '6.0', cpSalesTax: '7' } },
    { label: 'Used Sedan', values: { cpCarPrice: '22000', cpDownPayment: '4000', cpTradeIn: '0', cpLoanTerm: '48', cpApr: '7.5', cpSalesTax: '5' } },
    { label: 'Lease Buyout', values: { cpCarPrice: '18000', cpDownPayment: '0', cpTradeIn: '0', cpLoanTerm: '36', cpApr: '5.0', cpSalesTax: '6' } },
    { label: 'Luxury Lease', values: { cpCarPrice: '65000', cpDownPayment: '13000', cpTradeIn: '8000', cpLoanTerm: '36', cpApr: '4.5', cpSalesTax: '8' } },
  ],
  compute: (v) => {
    const taxAmount = (v.cpCarPrice - v.cpTradeIn) * (v.cpSalesTax / 100)
    const loanAmount = v.cpCarPrice - v.cpDownPayment - v.cpTradeIn + taxAmount
    const r = v.cpApr / 100 / 12
    const n = v.cpLoanTerm
    const monthlyPayment = r === 0 ? loanAmount / n : loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = monthlyPayment * n
    const totalInterest = totalPaid - loanAmount
    const downPct = v.cpCarPrice > 0 ? (v.cpDownPayment / v.cpCarPrice) * 100 : 0
    const taxPct = v.cpCarPrice > 0 ? (taxAmount / v.cpCarPrice) * 100 : 0
    return {
      result: monthlyPayment, label: 'Monthly Payment', unit: '$',
      steps: [
        { label: 'Car Price', value: `$${v.cpCarPrice.toFixed(2)}` },
        { label: 'Down Payment', value: `-$${v.cpDownPayment.toFixed(2)} (${downPct.toFixed(0)}%)` },
        { label: 'Trade-In Credit', value: `-$${v.cpTradeIn.toFixed(2)}` },
        { label: 'Sales Tax', value: `+$${taxAmount.toFixed(2)} (${v.cpSalesTax}% of $${(v.cpCarPrice - v.cpTradeIn).toFixed(0)})` },
        { label: 'Loan Amount', value: `$${loanAmount.toFixed(2)}` },
        { label: 'Monthly Payment', value: `$${monthlyPayment.toFixed(2)} @ ${v.cpApr}% for ${n} months` },
        { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
        { label: 'Total Loan Cost', value: `$${totalPaid.toFixed(2)} (price + tax + interest)` },
      ],
      extras: [
        { label: 'The 20/4/10 Rule Check', value: `20% down: should be $${(v.cpCarPrice * 0.2).toFixed(0)} (you put $${v.cpDownPayment.toFixed(0)}). 4yr term: 48mo (you chose ${n}mo). Payment ≤10% gross: check vs. income.` },
        { label: 'Total Vehicle Cost', value: `With $${v.cpDownPayment.toFixed(0)} down + $${totalPaid.toFixed(0)} in loan payments = $${(v.cpDownPayment + totalPaid).toFixed(0)} total out-of-pocket for this car.` },
        { label: 'APR Impact Over Term', value: `At ${v.cpApr}%, total interest = $${totalInterest.toFixed(2)}. A 1% lower rate (${Math.max(0, v.cpApr - 1).toFixed(1)}%) saves ~$${(loanAmount * (v.cpApr - Math.max(0, v.cpApr - 1)) / 100 * n / 24).toFixed(0)} over ${n} months.` },
        { label: 'Short vs Long Term', value: 'A 36-month term has ~25% lower total interest than 60 months, but ~50% higher monthly payment. Choose the shortest term you can afford. Never finance longer than you expect to own the car.' },
        { label: 'Gap Insurance Consideration', value: `If down payment < 20% (${downPct.toFixed(0)}%), you may owe more than the car is worth early in the loan. Gap insurance ($200-700) covers the difference if totaled.` },
        { label: 'Prepayment Penalty Check', value: 'Some lenders charge prepayment penalties for paying off early. Check your contract. Credit unions and online lenders rarely have penalties; some dealership financing does.' },
        { label: 'Credit Score Optimization', value: 'Check your credit score 6 months before buying. Scores 720+: qualify for best rates (3-5%). Scores 660-719: 6-9%. Scores below 660: consider improving score or finding a cosigner before applying.' },
        { label: 'Refinance Timing', value: `After 12-18 months of on-time payments, refinance if rates drop 1%+ or your credit score improves by 50+ points. Average refinance savings: $50-150/mo. Avoid refinancing to a longer term.` },
      ]
    }
  },
  description: 'Calculate monthly car payments including down payment, trade-in value, APR, sales tax, and loan term. See total interest paid and full loan cost for any vehicle purchase.',
  formula: 'Monthly = P × [r(1+r)^n] / [(1+r)^n - 1] where P = Price - Down - TradeIn + Tax, r = APR/12, n = months | Total Interest = TotalPaid - P',
  interpretation: 'Follow the 20/4/10 rule: 20% down, 4-year (48 month) term, total monthly payment ≤ 10% of gross monthly income. New car average: $48K at 7% for 60 months = ~$950/month. Shorter terms mean higher payments but drastically less interest paid over the life of the loan.'
}

export default calcDef
