import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ income: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), monthlyDebts: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), rentRatio: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'income', label: 'Monthly Gross Income ($)', type: 'number', min: 1000, step: '100' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rentRatio', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
  ],
  defaults: { income: '5000', monthlyDebts: '500', rentRatio: '30' },
  presets: [
    { label: 'Single Earner ($4k/mo)', values: { income: '4000', monthlyDebts: '300', rentRatio: '30' } },
    { label: 'Couple Dual Income ($8k/mo)', values: { income: '8000', monthlyDebts: '1000', rentRatio: '28' } },
    { label: 'High Debt Load ($5k/mo)', values: { income: '5000', monthlyDebts: '1500', rentRatio: '25' } },
  ],
  compute: (v) => {
    const ratioDecimal = v.rentRatio / 100
    const maxRent = v.income * ratioDecimal
    const remainingAfterDebts = maxRent - v.monthlyDebts
    const safeRent = Math.max(0, remainingAfterDebts)
    const dtiPct = ((v.monthlyDebts + safeRent) / v.income) * 100
    const annualIncomeNeeded = safeRent * 12 / 0.3
    const incomeNeededForRent = safeRent / 0.3
    return { result: safeRent, label: 'Affordable Rent', unit: '$', steps: [
      { label: '1. Max rent at target %', value: `${v.income} × ${v.rentRatio}% = $${maxRent.toFixed(0)}` },
      { label: '2. Subtract monthly debts', value: `$${maxRent.toFixed(0)} - $${v.monthlyDebts} = $${safeRent.toFixed(0)}` },
      { label: '3. Your rent-to-income ratio', value: `$${safeRent.toFixed(0)} ÷ $${v.income} = ${(safeRent/v.income*100).toFixed(1)}%` },
      { label: '4. Back-end DTI ratio', value: `($${v.monthlyDebts} + $${safeRent.toFixed(0)}) ÷ $${v.income} = ${dtiPct.toFixed(1)}%` },
      { label: '5. Income needed (30% rule)', value: `$${safeRent.toFixed(0)} ÷ 0.30 = $${incomeNeededForRent.toFixed(0)}/mo` },
      { label: '6. Annual income needed', value: `$${incomeNeededForRent.toFixed(0)} × 12 = $${annualIncomeNeeded.toFixed(0)}/yr` },
    ] ,
    extras: [
      { label: "30% Rule", value: "Spend no more than 30% of gross income on rent. Landlords typically enforce this strictly — rent > 30% often requires a co-signer." },
      { label: "36% Back-End DTI", value: "Lenders prefer total debt payments (including rent) ≤ 36% of income. Above 43% makes qualifying for mortgages difficult." },
      { label: "Credit Score Impact", value: "Landlords check credit scores — 620+ is typically required. Paying rent on time can build credit if reported to bureaus." },
      { label: "Renters Insurance", value: "Renters insurance costs $15-30/month and covers belongings ($15,000-50,000) and liability. Many landlords require it." },
      { label: "Hidden Costs", value: "Factor in utilities ($100-200/mo), parking ($50-200/mo), pet fees ($25-75/mo), and renters insurance ($15-30/mo) beyond the base rent." },
      { label: "Lease Terms", value: "12-month leases typically have lower monthly rent than month-to-month (10-20% premium). Negotiate longer terms for lower rates." },
      { label: "Roommate Strategy", value: "Having a roommate can cut housing costs 30-50%. Many cities allow 2-3 unrelated tenants per unit — check local occupancy rules." },
      { label: "Salary Negotiation", value: "If your desired apartment costs more than 30% of income, consider negotiating salary, finding a cheaper unit, or increasing your down payment on a future mortgage." },
    ]}
  },
  description: 'Determine how much rent you can afford based on monthly income, existing debts, and desired rent-to-income ratio. Includes DTI analysis and income targets.',
  formula: 'Affordable Rent = Income × (Rent% ÷ 100) - Debts | DTI = (Debts + Rent) ÷ Income',
  interpretation: 'The 30% rule: spend ≤ 30% of gross income on rent. Keep total DTI under 36%. Landlords require credit scores of 620+. Budget an extra $150-300/mo for utilities, parking, and insurance.'
}

export default calcDef
