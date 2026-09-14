import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentSavings: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), annualContrib: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), employerMatch: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100'), expectedReturn: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 30, '0-30'), years: z.string().min(1, 'Required').refine(v => parseInt(v) > 0 && parseInt(v) <= 60, '1-60') }),
  fields: [{ name: 'currentSavings', label: 'Current 403(b) Balance ($)', type: 'number', min: 0, step: '100' }, { name: 'annualContrib', label: 'Annual Contribution ($)', type: 'number', min: 0, step: '100' }, { name: 'employerMatch', label: 'Employer Match (%)', type: 'number', min: 0, max: 100, step: '0.5' }, { name: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', min: 0, max: 30, step: '0.1' }, { name: 'years', label: 'Years Until Retirement', type: 'number', min: 1, max: 60, step: '1' }],
  defaults: { currentSavings: '25000', annualContrib: '5000', employerMatch: '50', expectedReturn: '7', years: '20' },
  presets: [
    { label: 'Early-Career Teacher', values: { currentSavings: '5000', annualContrib: '3000', employerMatch: '100', expectedReturn: '7', years: '35' } },
    { label: 'Mid-Career Max-Out', values: { currentSavings: '80000', annualContrib: '23000', employerMatch: '50', expectedReturn: '7', years: '15' } },
    { label: 'Non-Profit Employee', values: { currentSavings: '15000', annualContrib: '6000', employerMatch: '75', expectedReturn: '6', years: '25' } },
    { label: 'Conservative Saver', values: { currentSavings: '10000', annualContrib: '2400', employerMatch: '25', expectedReturn: '5', years: '30' } },
    { label: 'Hospital Employee Catch-Up', values: { currentSavings: '120000', annualContrib: '30500', employerMatch: '50', expectedReturn: '7', years: '10' } },
  ],
  compute: (v) => { const cs = parseFloat(v.currentSavings) || 0; const ac = parseFloat(v.annualContrib) || 0; const er = parseFloat(v.expectedReturn) || 0; const y = parseInt(v.years) || 1; const match = parseFloat(v.employerMatch) || 0; const totalContrib = ac * (1 + match / 100); const mr = er / 100 / 12; const m = y * 12; let fv = cs; if (mr > 0) fv = cs * Math.pow(1 + mr, m) + (totalContrib / 12) * ((Math.pow(1 + mr, m) - 1) / mr); else fv = cs + totalContrib * y; return { result: fv, label: 'Projected Balance', unit: '$', steps: [{ label: 'Current 403(b) balance', value: `$${cs.toFixed(2)}` }, { label: 'Annual contribution with employer match', value: `$${totalContrib.toFixed(2)}` }, { label: 'Monthly contribution into the plan', value: `$${(totalContrib / 12).toFixed(2)}` }, { label: 'Projected balance at retirement', value: `$${fv.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Maximize your 403(b) by contributing at least enough to capture the full employer match. The 2025–2026 limit is $23,500 ($31,000 age 50+).' },
      { label: 'Tax Consideration', value: '403(b) contributions are pre-tax, reducing AGI. Withdrawals taxed as ordinary income. Roth 403(b) options available at many employers.' },
      { label: 'Risk Note', value: '403(b) investment options may be limited to annuity contracts with higher fees. Compare expense ratios against low-cost index fund alternatives.' },
      { label: 'Comparison', value: 'Vs. 401(k): 403(b)s have identical limits but may offer fewer investment choices. Vs. IRA: higher limits but less fund selection.' },
      { label: 'Real-World Example', value: 'A teacher contributes $6,000/yr with a 5% employer match on $55k salary ($2,750). At 7% return over 30 years: balance grows to ~$832k.' },
    ]} },
  description: 'A 403(b) is a retirement plan for employees of public schools, tax-exempt organizations, and certain ministers. Contributions are made pre-tax and grow tax-deferred.',
  formula: 'FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r where PMT includes employer match',
  interpretation: 'This projects your 403(b) balance at retirement including the benefit of employer matching contributions. Higher match percentages significantly accelerate growth.'
}

export default calcDef
