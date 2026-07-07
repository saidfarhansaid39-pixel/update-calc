import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ collegeCost: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), currentSavings: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), monthlyContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), expectedReturn: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), yearsUntil: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 25, '0-25') }),
  fields: [{ name: 'collegeCost', label: 'Estimated College Cost ($)', type: 'number', min: 0, step: '1000' }, { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', min: 0, step: '100' }, { name: 'monthlyContrib', label: 'Monthly Contribution ($)', type: 'number', min: 0, step: '50' }, { name: 'expectedReturn', label: 'Expected Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'yearsUntil', label: 'Years Until College', type: 'number', min: 0, max: 25, step: '1' }],
  compute: (v) => { const cost = parseFloat(v.collegeCost) || 0; const cs = parseFloat(v.currentSavings) || 0; const mc = parseFloat(v.monthlyContrib) || 0; const rr = parseFloat(v.expectedReturn) || 0; const y = parseInt(v.yearsUntil) || 1; const mr = rr / 100 / 12; const m = y * 12; let fv = cs; if (mr > 0) fv = cs * Math.pow(1 + mr, m) + mc * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cs + mc * m; const gap = Math.max(0, cost - fv); return { result: fv, label: 'Projected College Fund', unit: '$', steps: [{ label: 'College Cost', value: `$${cost.toFixed(2)}` }, { label: 'Projected Savings', value: `$${fv.toFixed(2)}` }, { label: 'Remaining Gap', value: `$${gap.toFixed(2)}` }, { label: 'Status', value: fv >= cost ? 'On track!' : 'Underfunded' }] } },
  description: '529 college savings calculator helps you determine if your current savings and contributions will cover future education costs.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r | Gap = Cost - Projected Value',
  interpretation: 'Compare your projected 529 savings against estimated college costs. If there is a gap, consider increasing contributions or exploring other education funding options.'
}

export default calcDef
