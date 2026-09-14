import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), annualDeferral: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsToRetire: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60'), isGovt: z.string().min(1) }),
  fields: [{ name: 'currentBalance', label: 'Current 457(b) Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'annualDeferral', label: 'Annual Deferral ($)', type: 'number', min: 0, step: '100' }, { name: 'returnRate', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsToRetire', label: 'Years to Retirement', type: 'number', min: 1, max: 60, step: '1' }, { name: 'isGovt', label: 'Plan Type', type: 'select', options: [{ label: 'Governmental', value: 'govt' }, { label: 'Non-Governmental', value: 'nongovt' }] }],
  defaults: { currentBalance: '20000', annualDeferral: '6000', returnRate: '7', yearsToRetire: '20', isGovt: 'govt' },
  presets: [
    { label: 'Municipal Employee Starter', values: { currentBalance: '2000', annualDeferral: '3000', returnRate: '7', yearsToRetire: '30', isGovt: 'govt' } },
    { label: 'State Administrator', values: { currentBalance: '75000', annualDeferral: '12000', returnRate: '7', yearsToRetire: '15', isGovt: 'govt' } },
    { label: 'Non-Governmental Executive', values: { currentBalance: '100000', annualDeferral: '23000', returnRate: '8', yearsToRetire: '10', isGovt: 'nongovt' } },
    { label: 'Early Retiree Planner', values: { currentBalance: '50000', annualDeferral: '15000', returnRate: '6', yearsToRetire: '12', isGovt: 'govt' } },
    { label: 'Max-Out Saver', values: { currentBalance: '30000', annualDeferral: '23000', returnRate: '7', yearsToRetire: '20', isGovt: 'govt' } },
  ],
  compute: (v) => { const cb = parseFloat(v.currentBalance) || 0; const ad = parseFloat(v.annualDeferral) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.yearsToRetire) || 1; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + (ad / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + ad * y; return { result: fv, label: 'Projected Balance', unit: '$', steps: [{ label: 'Current 457(b) balance', value: `$${cb.toFixed(2)}` }, { label: 'Annual deferral amount', value: `$${ad.toFixed(2)}` }, { label: 'Monthly contribution into plan', value: `$${(ad / 12).toFixed(2)}` }, { label: 'Projected 457(b) value at retirement', value: `$${fv.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: '457(b) plans offer unique flexibility — no 10% early withdrawal penalty if you separate from service. Contribute up to $23,500 in 2025–2026.' },
      { label: 'Tax Consideration', value: 'Pre-tax deferrals reduce current year taxable income. Withdrawals taxed as ordinary income. Governmental plans provide stronger creditor protection.' },
      { label: 'Risk Note', value: 'Non-governmental 457(b) assets remain employer assets until distribution — bankruptcy risk is real. Governmental plans are fully participant-owned.' },
      { label: 'Comparison', value: 'Vs. 401(k)/403(b): 457(b) allows penalty-free early withdrawals. Can be used alongside 403(b) for double the contribution space — up to $47,000 total.' },
      { label: 'Real-World Example', value: 'A city employee defers $6,000/yr for 20 years at 7% return starting with $20k balance. Projected balance: ~$311k — withdrawable penalty-free at any separation age.' },
    ]} },
  description: 'A 457(b) plan is a deferred compensation retirement plan available to state and local government employees and certain non-governmental entities.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r',
  interpretation: '457(b) plans allow penalty-free withdrawals before age 59½ if you separate from service. Governmental plans offer greater protection than non-governmental plans.'
}

export default calcDef
