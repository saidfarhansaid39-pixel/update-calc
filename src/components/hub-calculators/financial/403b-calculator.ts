import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentSavings: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), annualContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), employerMatch: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), expectedReturn: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60') }),
  fields: [{ name: 'currentSavings', label: 'Current 403(b) Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'annualContrib', label: 'Annual Contribution ($)', type: 'number', min: 0, step: '100' }, { name: 'employerMatch', label: 'Employer Match (%)', type: 'number', min: 0, max: 100, step: '0.5' }, { name: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'years', label: 'Years Until Retirement', type: 'number', min: 1, max: 60, step: '1' }],
  compute: (v) => { const cs = parseFloat(v.currentSavings) || 0; const ac = parseFloat(v.annualContrib) || 0; const er = parseFloat(v.expectedReturn) || 0; const y = parseInt(v.years) || 1; const match = parseFloat(v.employerMatch) || 0; const totalContrib = ac * (1 + match / 100); const mr = er / 100 / 12; const m = y * 12; let fv = cs; if (mr > 0) fv = cs * Math.pow(1 + mr, m) + (totalContrib / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cs + totalContrib * y; return { result: fv, label: 'Projected Balance', unit: '$', steps: [{ label: 'Current Savings', value: `$${cs.toFixed(2)}` }, { label: 'Annual Contribution (with match)', value: `$${totalContrib.toFixed(2)}` }, { label: 'Projected at Retirement', value: `$${fv.toFixed(2)}` }] } },
  description: 'A 403(b) is a retirement plan for employees of public schools, tax-exempt organizations, and certain ministers. Contributions are made pre-tax and grow tax-deferred.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r where PMT includes employer match',
  interpretation: 'This projects your 403(b) balance at retirement including the benefit of employer matching contributions. Higher match percentages significantly accelerate growth.'
}

export default calcDef
