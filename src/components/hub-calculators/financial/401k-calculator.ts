import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const matchPct = (v: string) => parseFloat(v) >= 0 && parseFloat(v) <= 100
const pct = (label: string) => z.string().min(1, `${label} required`).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100')
const num = (label: string, min = 0, max = 1e9) => z.string().min(1, `${label} required`).refine(v => {
  const n = parseFloat(v); return !isNaN(n) && n >= min && n <= max
}, `${min}-${max}`)
const int = (label: string, min = 0, max = 120) => z.string().min(1, `${label} required`).refine(v => {
  const n = parseInt(v); return !isNaN(n) && n >= min && n <= max
}, `${min}-${max}`)

const thirty = 30
const hundred = 100
const million = 1_000_000

const calcDef: CalcDef = {
  schema: z.object({
    salary: num('Salary', 0, million),
    currentAge: int('Current age', 18, 80),
    retirementAge: int('Retirement age', 30, 100),
    currentBalance: num('Balance', 0, 10 * million),
    contribRate: num('Contribution rate', 0, hundred),
    employerMatch: num('Employer match', 0, hundred),
    matchLimit: num('Match limit', 0, hundred),
    returnRate: num('Return rate', 0, thirty),
    retirementYears: int('Retirement years', 1, 60),
    taxRate: num('Tax rate', 0, 50),
    withdrawFreq: z.enum(['monthly', 'quarterly', 'semi-annually', 'yearly']),
    payoutReturn: num('Payout return', 0, thirty),
    salaryGrowth: num('Salary growth', 0, 20).optional().or(z.literal('')),
    inflation: num('Inflation', 0, 20).optional().or(z.literal('')),
    compoundFreq: z.enum(['monthly', 'quarterly', 'semi-annually', 'annually', 'daily']).optional(),
    contribTiming: z.enum(['beginning', 'end']).optional(),
    withdrawTiming: z.enum(['beginning', 'end']).optional(),
  }),
  fields: [
    { name: 'salary', label: 'Annual Salary ($)', type: 'number', min: 0, max: million, step: '1000' },
    { name: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 80, step: '1' },
    { name: 'retirementAge', label: 'Retirement Age', type: 'number', min: 30, max: 100, step: '1' },
    { name: 'currentBalance', label: 'Current 401(k) Balance ($)', type: 'number', min: 0, step: '1000' },
    { name: 'contribRate', label: 'Your Contribution Rate (%)', type: 'number', min: 0, max: 100, step: '0.5' },
    { name: 'employerMatch', label: 'Employer Match (%)', type: 'number', min: 0, max: 100, step: '0.5' },
    { name: 'matchLimit', label: 'Employer Match Limit (%)', type: 'number', min: 0, max: 100, step: '0.5' },
    { name: 'returnRate', label: 'Expected Annual Return (%)', type: 'number', min: 0, max: thirty, step: '0.1' },
    { name: 'retirementYears', label: 'Years in Retirement', type: 'number', min: 1, max: 60, step: '1' },
    { name: 'taxRate', label: 'Income Tax Rate (%)', type: 'number', min: 0, max: 50, step: '0.5' },
    { name: 'withdrawFreq', label: 'Withdrawal Frequency', type: 'select', options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'semi-annually', label: 'Semi-annually' },
      { value: 'yearly', label: 'Yearly' },
    ] },
    { name: 'payoutReturn', label: 'Return During Payout Phase (%)', type: 'number', min: 0, max: thirty, step: '0.1' },
    { name: 'salaryGrowth', label: 'Salary Growth Rate (%) (optional)', type: 'number', min: 0, max: 20, step: '0.1' },
    { name: 'inflation', label: 'Inflation Rate (%) (optional)', type: 'number', min: 0, max: 20, step: '0.1' },
    { name: 'compoundFreq', label: 'Compounding Method', type: 'select', options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'semi-annually', label: 'Semi-annually' },
      { value: 'annually', label: 'Annually' },
      { value: 'daily', label: 'Daily' },
    ] },
    { name: 'contribTiming', label: 'Timing of Contributions', type: 'select', options: [
      { value: 'end', label: 'End of Period' },
      { value: 'beginning', label: 'Beginning of Period' },
    ] },
    { name: 'withdrawTiming', label: 'Timing of Withdrawals', type: 'select', options: [
      { value: 'beginning', label: 'Beginning of Period' },
      { value: 'end', label: 'End of Period' },
    ] },
  ],
  defaults: {
    salary: '75000',
    currentAge: '30',
    retirementAge: '65',
    currentBalance: '10000',
    contribRate: '6',
    employerMatch: '100',
    matchLimit: '6',
    returnRate: '7',
    retirementYears: '20',
    taxRate: '22',
    withdrawFreq: 'monthly',
    payoutReturn: '5',
  },
  presets: [
    { label: 'Young Professional (age 25)', values: { salary: '55000', currentAge: '25', retirementAge: '65', currentBalance: '2000', contribRate: '6', employerMatch: '100', matchLimit: '6', returnRate: '7', retirementYears: '20', taxRate: '22', withdrawFreq: 'monthly', payoutReturn: '5' } },
    { label: 'Mid-Career Catch-Up (age 45)', values: { salary: '95000', currentAge: '45', retirementAge: '65', currentBalance: '80000', contribRate: '10', employerMatch: '100', matchLimit: '6', returnRate: '7', retirementYears: '20', taxRate: '24', withdrawFreq: 'monthly', payoutReturn: '5', salaryGrowth: '3', inflation: '2.5' } },
    { label: 'High Earner Max-Out', values: { salary: '200000', currentAge: '35', retirementAge: '60', currentBalance: '50000', contribRate: '12', employerMatch: '50', matchLimit: '6', returnRate: '8', retirementYears: '25', taxRate: '32', withdrawFreq: 'monthly', payoutReturn: '5', compoundFreq: 'quarterly', salaryGrowth: '4' } },
    { label: 'Conservative Investor', values: { salary: '60000', currentAge: '30', retirementAge: '67', currentBalance: '15000', contribRate: '5', employerMatch: '100', matchLimit: '4', returnRate: '4', retirementYears: '20', taxRate: '12', withdrawFreq: 'monthly', payoutReturn: '3' } },
    { label: 'Late Starter (age 50)', values: { salary: '85000', currentAge: '50', retirementAge: '70', currentBalance: '30000', contribRate: '20', employerMatch: '100', matchLimit: '6', returnRate: '7', retirementYears: '15', taxRate: '22', withdrawFreq: 'monthly', payoutReturn: '5', salaryGrowth: '2', catchUp: '7500' } },
  ],
  compute: (v) => {
    const salary = Number(v.salary) || 75000
    const ca = Number(v.currentAge) || 30
    const ra = Number(v.retirementAge) || 65
    const cb = Number(v.currentBalance) || 0
    const cr = (Number(v.contribRate) || 6) / 100
    const em = (Number(v.employerMatch) || 100) / 100
    const ml = (Number(v.matchLimit) || 6) / 100
    const rr = (Number(v.returnRate) || 7) / 100
    const ry = Number(v.retirementYears) || 20
    const tr = (Number(v.taxRate) || 22) / 100
    const wf = (v.withdrawFreq as string) || 'monthly'
    const pr = (Number(v.payoutReturn) || 5) / 100
    const sg = (Number(v.salaryGrowth) || 0) / 100
    const infl = (Number(v.inflation) || 0) / 100
    const cf = (v.compoundFreq as string) || 'monthly'
    const ct = (v.contribTiming as string) || 'end'
    const wt = (v.withdrawTiming as string) || 'beginning'

    const years = Math.max(1, ra - ca)

    const effectiveCr = Math.min(cr, ml)
    const employeeContribYr = salary * cr
    const employerContribYr = salary * effectiveCr * em
    const totalContribYr = employeeContribYr + employerContribYr

    const compoundPerYear: Record<string, number> = { daily: 365, monthly: 12, quarterly: 4, 'semi-annually': 2, annually: 1 }
    const nPerYear = compoundPerYear[cf] || 12
    const periods = years * nPerYear
    const rPerPeriod = Math.pow(1 + rr, 1 / nPerYear) - 1
    const contribPerPeriod = totalContribYr / nPerYear

    let fv = cb
    for (let i = 0; i < periods; i++) {
      const addAtStart = ct === 'beginning'
      if (addAtStart) fv += contribPerPeriod
      fv *= (1 + rPerPeriod)
      if (!addAtStart) fv += contribPerPeriod
    }

    const totalContrib = totalContribYr * years + cb

    const wfPerYear: Record<string, number> = { monthly: 12, quarterly: 4, 'semi-annually': 2, yearly: 1 }
    const wfN = wfPerYear[wf] || 12
    const payoutPeriods = ry * wfN
    const rPerPayout = Math.pow(1 + pr, 1 / wfN) - 1

    let wd = 0
    if (rPerPayout > 0) {
      const factor = Math.pow(1 + rPerPayout, payoutPeriods)
      const useBegin = wt === 'beginning'
      if (useBegin) {
        wd = fv * (rPerPayout * factor) / (factor - 1) / (1 + rPerPayout)
      } else {
        wd = fv * (rPerPayout * factor) / (factor - 1)
      }
    } else {
      wd = fv / payoutPeriods
    }

    const afterTaxWd = wd * (1 - tr)
    const totalWd = afterTaxWd * payoutPeriods
    const totalReturn = fv - totalContrib

    const inflAdjWd = infl > 0 ? fv / Math.pow(1 + infl, years) : 0

    const freqLabels: Record<string, string> = { monthly: 'monthly', quarterly: 'quarterly', 'semi-annually': 'semi-annually', yearly: 'yearly' }
    const lastWdDate = new Date()
    lastWdDate.setFullYear(lastWdDate.getFullYear() + years + ry)

    return {
      result: fv, label: 'Balance at First Withdrawal', unit: '$',
      steps: [
        { label: 'Years until retirement', value: `${years}` },
        { label: 'Your annual contribution', value: `$${employeeContribYr.toFixed(2)}` },
        { label: 'Employer annual contribution', value: `$${employerContribYr.toFixed(2)}` },
        { label: 'Total annual contribution (with match)', value: `$${totalContribYr.toFixed(2)}` },
        { label: 'Balance at first withdrawal', value: `$${fv.toFixed(2)}` },
        { label: `${freqLabels[wf] || 'monthly'} withdrawal (before tax)`, value: `$${wd.toFixed(2)}` },
        { label: `${freqLabels[wf] || 'monthly'} withdrawal (after ${(tr * 100).toFixed(1)}% tax)`, value: `$${afterTaxWd.toFixed(2)}` },
        { label: 'Total withdrawal (after tax)', value: `$${totalWd.toFixed(2)}` },
        { label: 'Total contribution', value: `$${totalContrib.toFixed(2)}` },
        { label: 'Total return', value: `$${totalReturn.toFixed(2)}` },
        { label: 'Number of withdrawals', value: `${payoutPeriods}` },
      ],
      extras: [
        { label: 'Strategy Note', value: 'Contribute at least enough to capture the full employer match — a guaranteed 100% return on matched dollars. The 2025–2026 limit is $23,500 ($31,000 if age 50+).' },
        { label: 'Tax Consideration', value: 'Traditional 401(k) contributions reduce current taxable income; withdrawals taxed as ordinary income. Roth 401(k) offers tax-free withdrawals if held 5+ years.' },
        { label: 'Risk Note', value: 'Avoid over-concentration in company stock (common with employer match). Diversify into broad-market index funds. Early withdrawals before 59½ incur a 10% penalty.' },
        { label: 'Comparison', value: 'Vs. IRA: higher limits ($23,500 vs $7,000) but fewer investment choices. Vs. Roth IRA: no income phase-out limits. Vs. taxable brokerage: tax-deferred compounding.' },
        { label: 'Real-World Example', value: 'A 30-year-old earning $75k contributes 10% ($7,500/yr) with a 6% employer match at 7% return. By 65: ~$1.4M. Without the match: ~$990k. The match adds $410k+.' },
      ],
    }
  },
  description: 'A 401(k) is an employer-sponsored retirement savings plan that allows employees to contribute pre-tax dollars, often with employer matching contributions.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | Payout: PMT = PV × (r(1+r)^n) / ((1+r)^n - 1)',
  interpretation: 'Maximize your 401(k) by contributing at least enough to get the full employer match. The 2025-2026 contribution limit is $23,500 ($31,000 with catch-up for age 50+). Withdrawals are taxed as ordinary income.'
}

export default calcDef
