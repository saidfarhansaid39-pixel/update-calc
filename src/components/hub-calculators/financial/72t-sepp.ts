import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accountBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), age: z.string().min(1, 'Required').refine(v => parseInt(v) >= 30 && parseInt(v) <= 80, '30-80'), method: z.string().min(1), lifeExpectancy: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'accountBalance', label: 'IRA/Retirement Account Balance ($)', type: 'number', min: 0, step: '1000' }, { name: 'age', label: 'Current Age', type: 'number', min: 30, max: 80, step: '1' }, { name: 'method', label: 'Distribution Method', type: 'select', options: [{ label: 'Required Minimum Distribution', value: 'rmd' }, { label: 'Fixed Amortization', value: 'amort' }, { label: 'Fixed Annuitization', value: 'annuity' }] }, { name: 'lifeExpectancy', label: 'Life Expectancy Factor', type: 'number', min: 1, step: '0.5' }],
  compute: (v) => { const bal = parseFloat(v.accountBalance) || 0; const le = parseFloat(v.lifeExpectancy) || 25; const method = v.method || 'rmd'; let annualPayment = 0; if (method === 'rmd') annualPayment = bal / le; else if (method === 'amort') annualPayment = bal / le * 1.2; else annualPayment = bal * (0.05 + 1 / le); const monthly = annualPayment / 12; return { result: annualPayment, label: 'Annual SEPP Distribution', unit: '$', steps: [{ label: 'Account Balance', value: `$${bal.toFixed(2)}` }, { label: 'Life Expectancy Factor', value: `${le.toFixed(1)}` }, { label: 'Annual Distribution', value: `$${annualPayment.toFixed(2)}` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }] } },
  description: 'Section 72(t) SEPP (Substantially Equal Periodic Payments) allows penalty-free early withdrawals from retirement accounts before age 59½.',
  formula: 'SEPP = Account Balance / Life Expectancy Factor (RMD method) | Must continue for 5 years or until age 59½, whichever is longer',
  interpretation: '72(t) SEPP avoids the 10% early withdrawal penalty but requires strict adherence to the distribution schedule. Modifying the payments before the end of the term triggers retroactive penalties.'
}

export default calcDef
