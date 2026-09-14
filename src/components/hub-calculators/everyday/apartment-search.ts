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
  defaults: { aptMonthlyIncome: '5000', aptMonthlyDebts: '400', aptRentTarget: '1400', aptDepositPct: '1', aptUtilitiesEst: '150', aptParkingCost: '75' },
  presets: [
    { label: 'Studio ($1000 rent)', values: { aptMonthlyIncome: '4000', aptMonthlyDebts: '200', aptRentTarget: '1000', aptDepositPct: '1', aptUtilitiesEst: '120', aptParkingCost: '0' } },
    { label: '1BR Downtown ($1800)', values: { aptMonthlyIncome: '6000', aptMonthlyDebts: '500', aptRentTarget: '1800', aptDepositPct: '1', aptUtilitiesEst: '150', aptParkingCost: '200' } },
    { label: '2BR Suburbs ($2200)', values: { aptMonthlyIncome: '8000', aptMonthlyDebts: '1000', aptRentTarget: '2200', aptDepositPct: '1.5', aptUtilitiesEst: '200', aptParkingCost: '0' } },
  ],
  compute: (v) => {
    const upfrontTotal = v.aptRentTarget * v.aptDepositPct + v.aptRentTarget
    const monthlyTotal = v.aptRentTarget + v.aptUtilitiesEst + v.aptParkingCost
    const rentIncomePct = (v.aptRentTarget / v.aptMonthlyIncome) * 100
    const debtIncomePct = ((v.aptMonthlyDebts + monthlyTotal) / v.aptMonthlyIncome) * 100
    const affordable28 = monthlyTotal <= v.aptMonthlyIncome * 0.28 ? 'Yes' : 'No'
    const affordable30 = monthlyTotal <= v.aptMonthlyIncome * 0.30 ? 'Yes' : 'No'
    const annualRent = v.aptRentTarget * 12
    return { result: monthlyTotal, label: 'Total Monthly Housing Cost', unit: '$', steps: [
      { label: '1. Base rent', value: `$${v.aptRentTarget.toFixed(0)}/mo` },
      { label: '2. Utilities + parking', value: `$${v.aptUtilitiesEst.toFixed(0)} + $${v.aptParkingCost.toFixed(0)} = $${(v.aptUtilitiesEst + v.aptParkingCost).toFixed(0)}` },
      { label: '3. True monthly cost', value: `$${v.aptRentTarget.toFixed(0)} + $${(v.aptUtilitiesEst + v.aptParkingCost).toFixed(0)} = $${monthlyTotal.toFixed(0)}` },
      { label: '4. Rent/Income ratio', value: `$${v.aptRentTarget.toFixed(0)} ÷ $${v.aptMonthlyIncome} = ${rentIncomePct.toFixed(1)}%` },
      { label: '5. Front-end DTI (28% rule)', value: `${rentIncomePct.toFixed(1)}% — ${affordable28}` },
      { label: '6. Back-end DTI (36% rule)', value: `${debtIncomePct.toFixed(1)}%` },
      { label: '7. Move-in costs', value: `$${v.aptRentTarget.toFixed(0)} × ${v.aptDepositPct} + $${v.aptRentTarget.toFixed(0)} = $${upfrontTotal.toFixed(0)}` },
      { label: '8. Annual rent total', value: `$${v.aptRentTarget.toFixed(0)} × 12 = $${annualRent.toFixed(0)}` },
    ] ,
    extras: [
      { label: "28% Front-End Rule", value: "Housing costs (rent + utilities + parking) should not exceed 28% of gross monthly income. This is the standard lenders use for mortgages." },
      { label: "36% Back-End Rule", value: "Total debt payments (housing + car loans + credit cards + student loans) should stay under 36% of gross income." },
      { label: "3x Rent Requirement", value: "Most landlords require monthly income ≥ 3× the rent. For $1,500 rent, you need $4,500/mo minimum. Some accept 2.5× with good credit." },
      { label: "Move-In Budget", value: "Expect first month's rent + security deposit (1-2 months) + possible broker fee. Budget 2-3× the monthly rent in upfront cash." },
      { label: "Renters Insurance", value: "$15-30/month covers $15,000-50,000 in personal property and $100,000+ liability. Some landlords require proof before move-in." },
      { label: "Utility Average Costs", value: "Electric: $50-120, Water/Sewer: $30-60, Gas: $20-60, Internet: $40-80, Trash: $10-25. Verify which are included in rent." },
      { label: "Parking Considerations", value: "Urban parking costs $100-300/mo. Suburbs are often free. Street parking may require a permit ($25-200/yr). Factor this into your true cost." },
      { label: "Lease Renewal Leverage", value: "After 12 months, negotiate renewal. Landlords often prefer stable tenants over turnover. You may get 5-10% off or free amenities." },
    ]}
  },
  description: 'Evaluate apartment affordability using the 28% front-end and 36% back-end DTI rules. Factor in utilities, parking, security deposits, and total move-in costs.',
  formula: 'Total Monthly = Rent + Utilities + Parking | Front-End = Rent ÷ Income × 100 | Back-End = (Debts + Total) ÷ Income × 100 | Move-In = Rent × Deposit + First Rent',
  interpretation: 'Target ≤ 28% front-end and ≤ 36% back-end DTI. Budget 2-3× rent for move-in. Include $150-300/mo for utilities and parking. Landlords need 3× rent in income.'
}

export default calcDef
