import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), annualDeferral: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsToRetire: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60'), isGovt: z.string().min(1) }),
  fields: [{ name: 'currentBalance', label: 'Current 457(b) Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'annualDeferral', label: 'Annual Deferral ($)', type: 'number', min: 0, step: '100' }, { name: 'returnRate', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsToRetire', label: 'Years to Retirement', type: 'number', min: 1, max: 60, step: '1' }, { name: 'isGovt', label: 'Plan Type', type: 'select', options: [{ label: 'Governmental', value: 'govt' }, { label: 'Non-Governmental', value: 'nongovt' }] }],
  compute: (v) => { const cb = parseFloat(v.currentBalance) || 0; const ad = parseFloat(v.annualDeferral) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.yearsToRetire) || 1; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + (ad / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + ad * y; return { result: fv, label: 'Projected Balance', unit: '$', steps: [{ label: 'Current Balance', value: `$${cb.toFixed(2)}` }, { label: 'Annual Deferral', value: `$${ad.toFixed(2)}` }, { label: 'Projected Value', value: `$${fv.toFixed(2)}` }] } },
  description: 'A 457(b) plan is a deferred compensation retirement plan available to state and local government employees and certain non-governmental entities.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r',
  interpretation: '457(b) plans allow penalty-free withdrawals before age 59½ if you separate from service. Governmental plans offer greater protection than non-governmental plans.'
}

export default calcDef
