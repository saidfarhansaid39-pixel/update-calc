import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ income: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), debts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), downPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), termYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), taxesYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), insuranceYearly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'income', label: 'Annual Household Income ($)', type: 'number', min: 20000, step: '10000' },
    { name: 'debts', label: 'Monthly Debts ($)', type: 'number', min: 0, step: '100' },
    { name: 'downPct', label: 'Down Payment (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'rate', label: 'Interest Rate (%)', type: 'number', min: 0.1, step: '0.25' },
    { name: 'termYears', label: 'Loan Term (years)', type: 'number', min: 10, max: 40, step: '5' },
    { name: 'taxesYearly', label: 'Annual Property Taxes ($)', type: 'number', min: 0, step: '500' },
    { name: 'insuranceYearly', label: 'Annual Insurance ($)', type: 'number', min: 0, step: '200' },
  ],
  compute: (v) => { const monthlyIncome = v.income / 12; const maxPayment = monthlyIncome * 0.36; const maxAfterDebts = maxPayment - v.debts; const monthlyPITI = maxAfterDebts - (v.taxesYearly / 12) - (v.insuranceYearly / 12); const r = (v.rate / 100) / 12; const n = v.termYears * 12; const loanAmount = monthlyPITI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)); const homePrice = loanAmount / (1 - v.downPct / 100); return { result: homePrice, label: 'Max Home Price', unit: '$', steps: [{ label: 'Monthly Income', value: `$${monthlyIncome.toFixed(0)}` }, { label: 'Max Monthly Payment (36%)', value: `$${maxPayment.toFixed(0)}` }, { label: 'After Debts & PITI', value: `$${Math.max(0, monthlyPITI).toFixed(0)}/mo` }, { label: 'Loan Amount', value: `$${Math.max(0, loanAmount).toFixed(0)}` }, { label: 'Max Home Price', value: `$${Math.max(0, homePrice).toFixed(0)}` }] } },
  description: 'Determine the maximum home price you can afford based on income, debts, down payment, interest rate, and property expenses.',
  formula: 'Max Price = Loan Amount / (1 − Down%) | Loan = Max Payment × [(1+r)^n − 1] / [r(1+r)^n]',
  interpretation: 'Lenders use 28/36 rule: housing costs ≤28% of gross income, total debt ≤36%. A 20% down payment avoids PMI. Rates vary by credit score and market conditions.'
}

export default calcDef
