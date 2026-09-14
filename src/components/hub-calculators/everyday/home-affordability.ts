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
  defaults: { annualIncome: "85000", monthlyDebtsOther: "400", downPaymentPct: "10", interestRate: "6.5", loanTermYears: "30" },
  presets: [
    { label: "First-Time Buyer", values: { annualIncome: "75000", monthlyDebtsOther: "350", downPaymentPct: "5", interestRate: "6.75", loanTermYears: "30" } },
    { label: "Move-Up Buyer", values: { annualIncome: "120000", monthlyDebtsOther: "600", downPaymentPct: "20", interestRate: "6.25", loanTermYears: "30" } },
    { label: "High-Cost Area", values: { annualIncome: "200000", monthlyDebtsOther: "1000", downPaymentPct: "20", interestRate: "6.5", loanTermYears: "30" } },
    { label: "15-Year Mortgage", values: { annualIncome: "95000", monthlyDebtsOther: "300", downPaymentPct: "15", interestRate: "5.75", loanTermYears: "15" } },
  ],
  compute: (v) => {
    const monthlyIncome = v.annualIncome / 12
    const maxPayment = monthlyIncome * 0.28
    const maxTotalDebt = monthlyIncome * 0.36
    const availForMortgage = maxTotalDebt - v.monthlyDebtsOther
    const affordablePayment = Math.min(maxPayment, availForMortgage)
    const r = v.interestRate / 100 / 12
    const n = v.loanTermYears * 12
    const loanFactor = affordablePayment > 0 && r > 0 ? (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : 0
    const maxLoan = affordablePayment * loanFactor
    const downPct = v.downPaymentPct / 100
    const maxHomePrice = downPct < 1 ? maxLoan / (1 - downPct) : 0
    const downPaymentAmount = maxHomePrice * downPct
    const monthlyPi = maxHomePrice > 0 ? (maxHomePrice - downPaymentAmount) * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0
    return { result: maxHomePrice, label: 'Affordable Home Price', unit: '$', steps: [{ label: 'Monthly Gross Income', value: `$${monthlyIncome.toFixed(0)}` }, { label: 'Max Housing Payment (28%)', value: `$${maxPayment.toFixed(0)}` }, { label: 'Max Total Debt (36%)', value: `$${maxTotalDebt.toFixed(0)}` }, { label: 'After Existing Debts', value: `$${availForMortgage.toFixed(0)}/mo available` }, { label: 'Down Payment Needed', value: `$${downPaymentAmount.toFixed(0)} (${v.downPaymentPct}%)` }, { label: 'Max Affordable Home Price', value: `$${maxHomePrice.toFixed(0)}` }, { label: 'Est. P&I Payment', value: `$${monthlyPi.toFixed(2)}/mo` }] ,
    extras: [
      { label: "DTI Ratio Rules", value: "Front-end (housing): max 28% of gross income | Back-end (total debt): max 36% | Some lenders allow up to 43% for strong borrowers" },
      { label: "Credit Score Impact", value: "760+: best rates | 700-759: good rates | 660-699: slightly higher | 620-659: subprime | Below 620: FHA/VA only" },
      { label: "Down Payment Options", value: "Conventional: 3-5% min | FHA: 3.5% (with MIP) | VA: 0% (eligible veterans) | USDA: 0% (rural) | 20% avoids PMI" },
      { label: "PMI Cost Estimate", value: "PMI costs 0.3-1.5% of loan amount annually if down payment is below 20%. Cancelable once you reach 20% equity." },
      { label: "Closing Costs", value: "2-5% of purchase price including origination, appraisal, title, escrow, and transfer taxes. Budget $6,000-15,000 on a $300K home." },
      { label: "Rate Lock Strategy", value: "Lock your rate when you're 30-45 days from closing. Rate floats can cost or save you ~0.25% per 0.25% Fed move." },
      { label: "HOA & Insurance", value: "Factor in HOA dues ($100-500/mo), homeowners insurance ($800-1,500/yr), and property taxes (0.5-2.5% of value annually)." },
      { label: "Pre-Approval vs Pre-Qual", value: "Pre-qualification is an estimate based on self-reported data. Pre-approval involves a credit pull and verified documents — required for serious offers." },
    ]}
  },
  description: 'See exactly how much home you can afford using the 28/36 debt-to-income rule. Factor in income, debts, down payment, interest rate, and loan term with detailed monthly breakdowns.',
  formula: 'Max Home Price = Max Affordable Monthly × Loan Factor ÷ (1 − Down%) | Loan Factor = [(1+r)^n − 1] / [r × (1+r)^n] | r = rate ÷ 12, n = years × 12',
  interpretation: 'The 28/36 rule is the industry standard: spend no more than 28% of gross monthly income on housing and no more than 36% on total debt including your mortgage. Lenders look at your debt-to-income ratio (DTI), credit score, and down payment to determine your rate and approval. First-time buyers often qualify for FHA loans with just 3.5% down and 580+ credit. Remember that your monthly payment will also include property taxes (0.5-2.5% of value), homeowners insurance, and possibly PMI and HOA dues — often adding 30-50% to the principal-and-interest payment shown here.'
}

export default calcDef
