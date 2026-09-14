import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ salary: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), contribPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), employerMatchPct: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60') }),
  fields: [{ name: 'salary', label: 'Annual Salary ($)', type: 'number', min: 0, step: '1000' }, { name: 'contribPct', label: 'Your Contribution (%)', type: 'number', min: 0, max: 100, step: '0.5' }, { name: 'employerMatchPct', label: 'Employer Match (%)', type: 'number', min: 0, max: 100, step: '0.5' }, { name: 'currentBalance', label: 'Current Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'returnRate', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'years', label: 'Years Until Retirement', type: 'number', min: 1, max: 60, step: '1' }],
  defaults: { salary: '55000', contribPct: '6', employerMatchPct: '50', currentBalance: '10000', returnRate: '7', years: '25' },
  presets: [
    { label: 'New Teacher Starting Out', values: { salary: '45000', contribPct: '5', employerMatchPct: '100', currentBalance: '0', returnRate: '7', years: '35' } },
    { label: 'Mid-Career Administrator', values: { salary: '85000', contribPct: '10', employerMatchPct: '50', currentBalance: '60000', returnRate: '7', years: '15' } },
    { label: 'Hospital Staff', values: { salary: '65000', contribPct: '8', employerMatchPct: '75', currentBalance: '25000', returnRate: '6', years: '20' } },
    { label: 'Catch-Up Saver (50+)', values: { salary: '75000', contribPct: '15', employerMatchPct: '50', currentBalance: '150000', returnRate: '7', years: '10' } },
    { label: 'Aggressive Max-Out', values: { salary: '120000', contribPct: '20', employerMatchPct: '100', currentBalance: '50000', returnRate: '8', years: '20' } },
  ],
  compute: (v) => { const sal = parseFloat(v.salary) || 0; const cp = parseFloat(v.contribPct) || 0; const emp = parseFloat(v.employerMatchPct) || 0; const cb = parseFloat(v.currentBalance) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.years) || 1; const yourContrib = sal * (cp / 100); const matchContrib = sal * (emp / 100); const totalAnnual = yourContrib + matchContrib; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + (totalAnnual / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + totalAnnual * y; return { result: fv, label: 'Projected 403(b) Balance', unit: '$', steps: [{ label: 'Your annual contribution from salary', value: `$${yourContrib.toFixed(2)}` }, { label: 'Employer match contribution per year', value: `$${matchContrib.toFixed(2)}` }, { label: 'Current 403(b) balance', value: `$${cb.toFixed(2)}` }, { label: 'Total annual contribution (you + employer)', value: `$${totalAnnual.toFixed(2)}` }, { label: 'Projected 403(b) balance at retirement', value: `$${fv.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Contribute enough to get the full employer match — it is free money. For 2025–2026, the 403(b) contribution limit is $23,500 ($31,000 with catch-up).' },
      { label: 'Tax Consideration', value: 'Pre-tax contributions lower your current taxable income. Withdrawals in retirement are taxed as ordinary income. Roth 403(b) available at many employers.' },
      { label: 'Risk Note', value: 'Many 403(b) plans offer only annuity-based investment options with higher fees (1–2% vs. 0.03% index funds). Check your plan expense ratios.' },
      { label: 'Comparison', value: 'Vs. 457(b): 403(b) has a 10% early withdrawal penalty before 59½; 457(b) does not. Vs. IRA: 403(b) has much higher contribution limits.' },
      { label: 'Real-World Example', value: 'A nurse earning $65k contributes 8% ($5,200) with a 75% match on first 6% ($2,925). At 6% return over 20 years: ~$335k vs. $200k without match.' },
    ]} },
  description: 'A 403(b) plan is a tax-advantaged retirement plan for employees of public schools, hospitals, and non-profit organizations, similar to a 401(k).',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r where PMT = salary × (your% + employer%)',
  interpretation: '403(b) plans offer tax-deferred growth with employer matching. Contribution limits for 2025-2026 are $23,000 base plus $7,500 catch-up for age 50+.'
}

export default calcDef
