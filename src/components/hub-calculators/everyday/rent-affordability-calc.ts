import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyDebts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rentRatio: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'annualIncome', label: 'Annual Gross Income ($)', type: 'number', min: 10000, step: '5000' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rentRatio', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
  ],
  compute: (v) => {
    const monthlyIncome = v.annualIncome / 12
    const maxRent = monthlyIncome * (v.rentRatio / 100)
    const safeRent = Math.max(0, maxRent - v.monthlyDebts)
    return { result: safeRent, label: 'Max Affordable Rent', unit: '$/mo', steps: [{ label: 'Monthly Income', value: `$${monthlyIncome.toFixed(0)}` }, { label: `Rent Budget (${v.rentRatio}%)`, value: `$${maxRent.toFixed(0)}` }, { label: 'After Debts', value: `$${safeRent.toFixed(0)}` }] }
  },
  description: 'Calculate maximum affordable monthly rent from annual income, debts, and rent-to-income ratio for apartment hunting.',
  formula: 'Rent = (AnnualIncome/12) × (RentRatio/100) - MonthlyDebts',
  interpretation: 'Most landlords require gross monthly rent to be 3× the monthly rent. A 30% front-end DTI ratio is common. Back-end DTI (including all debts) should be ≤36% for best approval odds.'
}

export default calcDef
