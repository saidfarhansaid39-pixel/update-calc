import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentBalance: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), annualContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), returnRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60'), catchUp: z.string().min(1) }),
  fields: [{ name: 'currentBalance', label: 'Current 457(b) Balance ($)', type: 'number', min: 0, step: '1000' }, { name: 'annualContrib', label: 'Annual Contribution ($)', type: 'number', min: 0, step: '500' }, { name: 'returnRate', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'years', label: 'Years Until Retirement', type: 'number', min: 1, max: 60, step: '1' }, { name: 'catchUp', label: 'Catch-Up Provision', type: 'select', options: [{ label: 'Standard (no catch-up)', value: 'none' }, { label: 'Age 50+ Catch-Up', value: 'age50' }, { label: '3-Year Catch-Up', value: '3yr' }] }],
  compute: (v) => { const cb = parseFloat(v.currentBalance) || 0; const ac = parseFloat(v.annualContrib) || 0; const rr = parseFloat(v.returnRate) || 0; const y = parseInt(v.years) || 1; const catchUp = v.catchUp || 'none'; const catchUpAmount = catchUp === 'age50' ? 7500 : catchUp === '3yr' ? 23000 * 2 : 0; const totalContrib = ac + catchUpAmount; const mr = rr / 100 / 12; const m = y * 12; let fv = cb; if (mr > 0) fv = cb * Math.pow(1 + mr, m) + (totalContrib / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cb + totalContrib * y; return { result: fv, label: 'Projected 457(b) Balance', unit: '$', steps: [{ label: 'Current Balance', value: `$${cb.toFixed(2)}` }, { label: 'Annual Contrib (incl catch-up)', value: `$${totalContrib.toFixed(2)}` }, { label: 'Projected Value', value: `$${fv.toFixed(2)}` }] } },
  description: 'A 457(b) plan is a deferred compensation retirement plan for state and local government employees, offering unique catch-up provisions and no early withdrawal penalty.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | Catch-up allows double contributions in final 3 years before retirement',
  interpretation: '457(b) plans allow penalty-free withdrawals upon separation from service at any age. The special 3-year catch-up provision allows doubling contributions in the final 3 years before retirement.'
}

export default calcDef
