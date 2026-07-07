import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), monthlyContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 25, '1-25'), stateTaxDed: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 15, '0-15') }),
  fields: [{ name: 'currentBalance', label: 'Current 529 Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'monthlyContrib', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' }, { name: 'returnRate', label: 'Expected Annual Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsUntil', label: 'Years Until Withdrawal', type: 'number', min: 1, max: 25, step: '1' }, { name: 'stateTaxDed', label: 'State Tax Deduction Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' }],
  compute: (v) => { const cb = parseFloat(v.currentBalance) || 0; const mc = parseFloat(v.monthlyContrib) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.yearsUntil) || 1; const std = parseFloat(v.stateTaxDed) || 0; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + mc * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + mc * m; const annualTaxSavings = mc * 12 * (std / 100); return { result: fv, label: 'Projected 529 Value', unit: '$', steps: [{ label: 'Current Balance', value: `$${cb.toFixed(2)}` }, { label: 'Total Contributions', value: `$${(cb + mc * m).toFixed(2)}` }, { label: 'Projected Value', value: `$${fv.toFixed(2)}` }, { label: 'Est. Annual Tax Savings', value: `$${annualTaxSavings.toFixed(2)}` }] } },
  description: 'A 529 savings plan is a tax-advantaged education savings vehicle. Earnings grow tax-free and withdrawals for qualified education expenses are tax-free.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | State tax deduction = contributions × state rate',
  interpretation: '529 plans offer federal tax-free growth and often state tax deductions. The earlier you start and the higher the return, the more your education savings grow tax-free.'
}

export default calcDef
