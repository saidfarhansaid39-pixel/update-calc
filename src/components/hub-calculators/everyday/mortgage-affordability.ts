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
  defaults: { income: '85000', debts: '400', downPct: '20', rate: '6.5', termYears: '30', taxesYearly: '3000', insuranceYearly: '1200' },
  presets: [
    { label: 'First-Time Buyer', values: { income: '65000', debts: '300', downPct: '10', rate: '6.875', termYears: '30', taxesYearly: '2400', insuranceYearly: '1000' } },
    { label: 'Move-Up Buyer', values: { income: '120000', debts: '600', downPct: '20', rate: '6.5', termYears: '30', taxesYearly: '4500', insuranceYearly: '1500' } },
    { label: 'Luxury Home', values: { income: '250000', debts: '1200', downPct: '25', rate: '6.25', termYears: '15', taxesYearly: '12000', insuranceYearly: '3000' } },
  ],
  compute: (v) => { const monthlyIncome = v.income / 12; const maxPayment = monthlyIncome * 0.36; const maxAfterDebts = maxPayment - v.debts; const monthlyPITI = maxAfterDebts - (v.taxesYearly / 12) - (v.insuranceYearly / 12); const r = (v.rate / 100) / 12; const n = v.termYears * 12; const loanAmount = monthlyPITI > 0 ? monthlyPITI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : 0; const homePrice = loanAmount / (1 - v.downPct / 100); const downPayment = homePrice * (v.downPct / 100); const housingRatio = monthlyPITI > 0 ? ((monthlyPITI + v.taxesYearly / 12 + v.insuranceYearly / 12) / monthlyIncome) * 100 : 0; const monthlyTotal = (loanAmount > 0 ? loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0) + v.taxesYearly / 12 + v.insuranceYearly / 12; return { result: Math.max(0, homePrice), label: 'Max Home Price', unit: '$', steps: [
    { label: 'Monthly Gross Income', value: `$${v.income.toFixed(0)} / 12 = $${monthlyIncome.toFixed(0)}` },
    { label: 'Max Total Payment (36% DTI)', value: `$${monthlyIncome.toFixed(0)} × 0.36 = $${maxPayment.toFixed(0)}` },
    { label: 'Minus Existing Debts', value: `$${maxPayment.toFixed(0)} − $${v.debts.toFixed(0)} = $${maxAfterDebts.toFixed(0)}` },
    { label: 'Minus Taxes & Insurance', value: `$${maxAfterDebts.toFixed(0)} − $${(v.taxesYearly / 12 + v.insuranceYearly / 12).toFixed(0)} = $${monthlyPITI.toFixed(0)}` },
    { label: 'Max Loan Amount', value: `$${Math.max(0, loanAmount).toFixed(0)}` },
    { label: 'Max Home Price', value: `$${Math.max(0, homePrice).toFixed(0)}` },
    { label: 'Down Payment (${v.downPct}%)', value: `$${downPayment.toFixed(0)}` },
    { label: 'Est. Monthly Payment', value: `$${monthlyTotal.toFixed(0)} (P&I + taxes + insurance)` },
  ] ,
    extras: [
      { label: '28/36 Rule', value: 'Lenders prefer housing costs ≤28% of gross income and total debt ≤36%. Our calculator uses 36% as the max DTI limit.' },
      { label: 'PMI Costs', value: 'Down payments under 20% require PMI — typically 0.5-1.5% of the loan amount annually (~$50-150/month per $100k borrowed).' },
      { label: 'Credit Score Impact', value: 'A 760+ credit score can save you 0.5-1% on rates vs a 620 score — that is $100-200/month on a $300k loan.' },
      { label: 'Closing Costs', value: 'Budget 2-5% of the home price for closing costs (appraisal, title, origination, escrow).' },
      { label: 'Housing Ratio', value: `Your front-end DTI (housing only): ${housingRatio.toFixed(1)}% (target: ≤28%)` },
      { label: 'Rate Shopping', value: 'Getting quotes from 3-5 lenders within 45 days counts as a single hard credit pull — shop around!' },
    ]} },
  description: 'Determine the maximum home price you can afford based on your income, existing debts, down payment, interest rate, and property expenses. Uses the standard 36% DTI rule with a complete monthly payment breakdown.',
  formula: 'MaxPrice = LoanAmount / (1 − DownPayment%) | LoanAmount = MonthlyPITI × [(1 + r)^n − 1] / [r × (1 + r)^n] | MonthlyPITI = (Income/12 × 0.36) − Debts − Taxes/12 − Insurance/12',
  interpretation: 'Lenders use the 28/36 rule: housing costs should not exceed 28% of gross income and total debt should stay under 36%. On an $85k income with $400/mo debts and a 20% down payment at 6.5%, you can afford approximately a $350k-400k home. A 20% down payment avoids PMI. Rates vary significantly by credit score (620 vs 760+ can differ by 1%+). Remember to budget 2-5% of the home price for closing costs.'
}

export default calcDef
