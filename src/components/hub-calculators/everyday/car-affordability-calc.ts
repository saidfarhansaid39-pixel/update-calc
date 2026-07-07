import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), downPayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), loanTerm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), interestRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyIncome', label: 'Monthly Take-Home Pay ($)', type: 'number', min: 500, step: '100' },
    { name: 'downPayment', label: 'Down Payment ($)', type: 'number', min: 0, step: '500' },
    { name: 'loanTerm', label: 'Loan Term (months)', type: 'number', min: 12, max: 84, step: '12' },
    { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', min: 0, max: 30, step: '0.5' },
  ],
  compute: (v) => {
    const allowedMonthly = v.monthlyIncome * 0.15
    const monthlyRate = (v.interestRate / 100) / 12
    const loanAmount = monthlyRate === 0 ? allowedMonthly * v.loanTerm : allowedMonthly * (1 - Math.pow(1 + monthlyRate, -v.loanTerm)) / monthlyRate
    const carPrice = loanAmount + v.downPayment
    return { result: carPrice, label: 'Affordable Car Price', unit: '$', steps: [{ label: 'Max Monthly Payment (15%)', value: `$${allowedMonthly.toFixed(0)}` }, { label: 'Loan Amount', value: `$${loanAmount.toFixed(0)}` }, { label: 'Plus Down Payment', value: `$${v.downPayment.toFixed(0)}` }, { label: 'Total Affordable', value: `$${carPrice.toFixed(0)}` }] }
  },
  description: 'Determine how much car you can afford based on monthly income, down payment, loan terms, and interest rates. Follows the 15% rule.',
  formula: 'Affordable = (Monthly×15%) × PV Factor + Down Payment',
  interpretation: 'The 15% rule: car payment ≤15% of take-home pay. Total car costs (payment + insurance + gas + maintenance) ≤20%. Typical down payment: 10-20%. Longer terms (72-84 mo) mean more interest paid.'
}

export default calcDef
