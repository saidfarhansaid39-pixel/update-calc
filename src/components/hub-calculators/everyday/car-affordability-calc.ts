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
  defaults: { monthlyIncome: '5000', downPayment: '4000', loanTerm: '48', interestRate: '6.5' },
  presets: [
    { label: 'First-Time Buyer', values: { monthlyIncome: '3500', downPayment: '2000', loanTerm: '60', interestRate: '7.5' } },
    { label: 'Mid-Career Professional', values: { monthlyIncome: '7000', downPayment: '10000', loanTerm: '48', interestRate: '5.9' } },
    { label: 'Luxury Buyer', values: { monthlyIncome: '12000', downPayment: '20000', loanTerm: '36', interestRate: '4.5' } },
    { label: 'Budget-Conscious', values: { monthlyIncome: '4000', downPayment: '5000', loanTerm: '36', interestRate: '6.0' } },
  ],
  compute: (v) => {
    const allowedMonthly = v.monthlyIncome * 0.15
    const monthlyRate = (v.interestRate / 100) / 12
    const loanAmount = monthlyRate === 0
      ? allowedMonthly * v.loanTerm
      : allowedMonthly * (1 - Math.pow(1 + monthlyRate, -v.loanTerm)) / monthlyRate
    const carPrice = loanAmount + v.downPayment
    const totalPaid = allowedMonthly * v.loanTerm
    const totalInterest = totalPaid - loanAmount
    const downPct = carPrice > 0 ? (v.downPayment / carPrice) * 100 : 0
    const incomePctPrice = v.monthlyIncome > 0 ? (carPrice / v.monthlyIncome) : 0
    return {
      result: carPrice, label: 'Affordable Car Price', unit: '$',
      steps: [
        { label: 'Take-Home Pay', value: `$${v.monthlyIncome.toFixed(0)}/mo` },
        { label: '15% Rule Max Payment', value: `$${allowedMonthly.toFixed(0)}/mo (${v.monthlyIncome} × 0.15)` },
        { label: 'Loan Term', value: `${v.loanTerm} months @ ${v.interestRate}% APR` },
        { label: 'Loan Amount', value: `$${loanAmount.toFixed(0)}` },
        { label: 'Down Payment', value: `+$${v.downPayment.toFixed(0)} (${downPct.toFixed(0)}% of car price)` },
        { label: 'Affordable Car Price', value: `$${carPrice.toFixed(0)}` },
        { label: 'Total Interest Paid', value: `$${totalInterest.toFixed(0)}` },
        { label: 'Price-to-Income Multiple', value: `${incomePctPrice.toFixed(1)}× monthly income` },
      ],
      extras: [
        { label: 'The 15% Rule Explained', value: 'Car payment should not exceed 15% of monthly take-home pay. Total car expenses (payment + insurance + gas + maintenance + parking) should stay under 20% of income.' },
        { label: 'The 20/4/10 Rule', value: 'Alternative guideline: 20% down payment, maximum 4-year (48-month) loan term, total transportation costs ≤10% of gross monthly income. This ensures you don\'t go upside-down on the loan.' },
        { label: 'Down Payment Impact', value: 'A 20% down payment ($${(carPrice * 0.2).toFixed(0)} for this car) avoids PMI-like protections on loans and immediately gives you equity. Less than 20% down may require gap insurance for loan-to-value protection.' },
        { label: 'Total Cost of Ownership', value: 'Insurance: $100-200/mo for full coverage. Gas: $150-300/mo. Maintenance: $50-150/mo. These add $300-650/mo on top of your car payment. Budget accordingly.' },
        { label: 'Loan Term Trap', value: '72-84 month loans lower monthly payments but add $3,000-8,000 in extra interest. A $30,000 loan at 7% for 60 months: $594/mo, $5,641 interest. For 84 months: $459/mo, $8,556 interest.' },
        { label: 'New vs Used Affordability', value: 'New cars lose 20-30% in year 1 and 40-50% in 3 years. A 3-year-old used car at $20K with $4K down and 5% over 48 months = $369/mo — well within the 15% rule at $5K income.' },
        { label: 'Interest Rate Factors', value: 'Rates depend on credit score (660+: 6-8%, 720+: 4-6%, 780+: 3-5%), loan term (shorter = lower rate), new vs used (used rates are 1-3% higher), and manufacturer incentives (0-2% APR promotions).' },
        { label: 'Pre-Approval vs Dealer Financing', value: 'Get pre-approved by a credit union or bank before visiting the dealer. Credit unions typically offer 0.5-2% lower rates. Compare dealer financing but don\'t let the monthly payment distract from the total price.' },
      ]
    }
  },
  description: 'Determine how much car you can afford based on monthly income, down payment, loan terms, and interest rates. Follows the 15% rule for responsible car buying.',
  formula: 'Affordable = (MonthlyIncome × 15%) × PV Factor + DownPayment | PV Factor = (1 - (1+r)^-n) / r | r = APR/12, n = months',
  interpretation: 'The 15% rule: car payment ≤ 15% of take-home pay. Total car costs (payment + insurance + gas + maintenance) ≤ 20% of income. Longer terms (72-84 mo) mean lower payments but thousands more in interest. Make at least 20% down payment and limit terms to 48 months or less.'
}

export default calcDef
