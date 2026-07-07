import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ aptMonthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aptMonthlyDebts: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), aptRentTarget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), aptDepositPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), aptUtilitiesEst: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), aptParkingCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'aptMonthlyIncome', label: 'Monthly Income ($)', type: 'number', min: 1000, step: '500' },
    { name: 'aptMonthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'aptRentTarget', label: 'Target Rent ($)', type: 'number', min: 100, step: '100' },
    { name: 'aptDepositPct', label: 'Security Deposit (months)', type: 'number', min: 0, max: 3, step: '0.5' },
    { name: 'aptUtilitiesEst', label: 'Estimated Utilities ($)', type: 'number', min: 0, step: '25' },
    { name: 'aptParkingCost', label: 'Parking Cost ($)', type: 'number', min: 0, step: '25' },
  ],
  compute: (v) => {
    const upfrontTotal = v.aptRentTarget * v.aptDepositPct + v.aptRentTarget
    const monthlyTotal = v.aptRentTarget + v.aptUtilitiesEst + v.aptParkingCost
    const rentIncomePct = (v.aptRentTarget / v.aptMonthlyIncome) * 100
    const debtIncomePct = ((v.aptMonthlyDebts + monthlyTotal) / v.aptMonthlyIncome) * 100
    const affordable = monthlyTotal <= v.aptMonthlyIncome * 0.28 ? 'Yes' : 'No'
    return { result: monthlyTotal, label: 'Total Monthly Housing Cost', unit: '$', steps: [{ label: 'Rent', value: `$${v.aptRentTarget.toFixed(0)}` }, { label: 'Utilities + Parking', value: `$${(v.aptUtilitiesEst + v.aptParkingCost).toFixed(0)}` }, { label: 'Rent/Income Ratio', value: `${rentIncomePct.toFixed(0)}%` }, { label: 'DTI Ratio', value: `${debtIncomePct.toFixed(0)}%` }, { label: 'Move-In Costs', value: `$${upfrontTotal.toFixed(0)}` }, { label: 'Affordable (28% rule)', value: affordable }] }
  },
  description: 'Evaluate apartment affordability using the 28% rent-to-income rule and 36% debt-to-income guideline. Factor in utilities, parking, and move-in costs.',
  formula: 'Total Monthly = Rent + Utilities + Parking | Rent/Income = Rent / Income × 100 | Move-In = Rent × Deposit + First Rent',
  interpretation: 'Landlords typically require 3× monthly rent in income. Budget 30% of gross income max for rent. Factor in utilities ($100-200), parking ($50-200), and renters insurance ($15-30) when comparing apartments.'
}

export default calcDef
