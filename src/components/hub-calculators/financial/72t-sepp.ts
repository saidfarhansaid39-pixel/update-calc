import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accountBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), age: z.string().min(1, 'Required').refine(v => parseInt(v) >= 30 && parseInt(v) <= 80, '30-80'), method: z.string().min(1), lifeExpectancy: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'accountBalance', label: 'IRA/Retirement Account Balance ($)', type: 'number', min: 0, step: '1000' }, { name: 'age', label: 'Current Age', type: 'number', min: 30, max: 80, step: '1' }, { name: 'method', label: 'Distribution Method', type: 'select', options: [{ label: 'Required Minimum Distribution', value: 'rmd' }, { label: 'Fixed Amortization', value: 'amort' }, { label: 'Fixed Annuitization', value: 'annuity' }] }, { name: 'lifeExpectancy', label: 'Life Expectancy Factor', type: 'number', min: 1, step: '0.5' }],
  defaults: { accountBalance: '500000', age: '45', method: 'rmd', lifeExpectancy: '38' },
  presets: [
    { label: 'Mid-Career Early Retirement', values: { accountBalance: '800000', age: '42', method: 'rmd', lifeExpectancy: '40.5' } },
    { label: 'Late-Start Career Change', values: { accountBalance: '350000', age: '50', method: 'amort', lifeExpectancy: '32.4' } },
    { label: 'Largest Possible Payout', values: { accountBalance: '1000000', age: '55', method: 'annuity', lifeExpectancy: '28.6' } },
    { label: 'Medical Leave Bridge', values: { accountBalance: '200000', age: '48', method: 'rmd', lifeExpectancy: '35.2' } },
    { label: 'Small IRA Bridge', values: { accountBalance: '150000', age: '53', method: 'rmd', lifeExpectancy: '30.6' } },
  ],
  compute: (v) => { const bal = parseFloat(v.accountBalance) || 0; const le = parseFloat(v.lifeExpectancy) || 25; const method = v.method || 'rmd'; let annualPayment = 0; if (method === 'rmd') annualPayment = bal / le; else if (method === 'amort') annualPayment = bal / le * 1.2; else annualPayment = bal * (0.05 + 1 / le); const monthly = annualPayment / 12; return { result: annualPayment, label: 'Annual SEPP Distribution', unit: '$', steps: [{ label: 'Retirement account balance', value: `$${bal.toFixed(2)}` }, { label: 'IRS life expectancy factor for current age', value: `${le.toFixed(1)} years` }, { label: 'Annual SEPP distribution under chosen method', value: `$${annualPayment.toFixed(2)}` }, { label: 'Equivalent monthly withdrawal amount', value: `$${monthly.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: '72(t) SEPP avoids the 10% early withdrawal penalty but locks you into 5 years or until age 59½ (whichever is longer). Choose the method that best matches your cash flow needs.' },
      { label: 'Tax Consideration', value: 'SEPP distributions are taxed as ordinary income. State tax treatment varies. A single modification triggers retroactive penalties on all prior distributions.' },
      { label: 'Risk Note', value: 'The IRS is strict — any modification (even accidental over-withdrawal) results in retroactive 10% penalties plus interest on all prior distributions. Use a CPA.' },
      { label: 'Comparison', value: 'Vs. Roth conversion ladder: SEPP allows immediate access but is inflexible. Vs. 401(k) loan: SEPP has no repayment requirement but is permanent once started.' },
      { label: 'Real-World Example', value: 'A 45-year-old with $500k IRA using RMD method (LE factor 38) withdraws ~$13,157/yr penalty-free. At age 59½ (14.5 years): cumulative withdrawals ~$190k.' },
    ]} },
  description: 'Section 72(t) SEPP (Substantially Equal Periodic Payments) allows penalty-free early withdrawals from retirement accounts before age 59½.',
  formula: 'SEPP = Account Balance / Life Expectancy Factor (RMD method) | Must continue for 5 years or until age 59½, whichever is longer',
  interpretation: '72(t) SEPP avoids the 10% early withdrawal penalty but requires strict adherence to the distribution schedule. Modifying the payments before the end of the term triggers retroactive penalties.'
}

export default calcDef
