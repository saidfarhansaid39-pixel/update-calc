import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyDebtsOther: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), downPaymentPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), interestRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), loanTermYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'annualIncome', label: 'Annual Household Income ($)', type: 'number', min: 20000, step: '10000' },
    { name: 'monthlyDebtsOther', label: 'Monthly Debts ($)', type: 'number', min: 0, step: '100' },
    { name: 'downPaymentPct', label: 'Down Payment (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', min: 1, step: '0.25' },
    { name: 'loanTermYears', label: 'Loan Term (years)', type: 'number', min: 10, max: 40, step: '5' },
  ],
  compute: (v) => {
    const monthlyIncome = v.annualIncome / 12
    const maxPayment = monthlyIncome * 0.28
    const maxTotalDebt = monthlyIncome * 0.36
    const availForMortgage = maxTotalDebt - v.monthlyDebtsOther
    const affordablePayment = Math.min(maxPayment, availForMortgage)
    const r = v.interestRate / 100 / 12
    const n = v.loanTermYears * 12
    const maxLoan = affordablePayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) / (1 - v.downPaymentPct / 100)
    const maxHomePrice = maxLoan / (1 - v.downPaymentPct / 100)
    return { result: maxHomePrice, label: 'Affordable Home Price', unit: '$', steps: [{ label: 'Monthly Income', value: `$${monthlyIncome.toFixed(0)}` }, { label: 'Max Monthly Payment (28%)', value: `$${maxPayment.toFixed(0)}` }, { label: 'Max Total Debt (36%)', value: `$${maxTotalDebt.toFixed(0)}` }, { label: 'Available for Mortgage', value: `$${availForMortgage.toFixed(0)}` }, { label: 'Max Home Price', value: `$${maxHomePrice.toFixed(0)}` }] }
  },
  description: 'Determine how much home you can afford using the 28/36 debt-to-income rule. Enter income, debts, down payment, and loan terms.',
  formula: 'Max Price = (Max Affordable Monthly × (1+r)^n-1) / (r×(1+r)^n) / (1-Down%) where 28% for housing, 36% total debt',
  interpretation: 'The 28/36 rule: spend max 28% of gross income on housing, 36% on total debt. Lenders typically require 620+ credit score and 3-20% down payment. First-time buyers may qualify for FHA loans with 3.5% down.'
}

export default calcDef
