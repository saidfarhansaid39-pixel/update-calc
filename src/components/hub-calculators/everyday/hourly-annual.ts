import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyWage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'hourlyWage', label: 'Hourly Wage ($)', type: 'number', min: 7.25, step: '1' },
    { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', min: 1, step: '5' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, step: '4' },
  ],
  compute: (v) => { const annual = v.hourlyWage * v.hoursPerWeek * v.weeksPerYear; const monthly = annual / 12; const biweekly = annual / 26; const weekly = annual / 52; return { result: annual, label: 'Annual Salary', unit: '$', steps: [{ label: 'Annual', value: `$${annual.toFixed(2)}` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }, { label: 'Biweekly', value: `$${biweekly.toFixed(2)}` }, { label: 'Weekly', value: `$${weekly.toFixed(2)}` }] } },
  description: 'Convert hourly wage to annual salary based on hours per week and weeks per year worked.',
  formula: 'Annual = Hourly Wage × Hours/Week × Weeks/Year',
  interpretation: 'Full-time US standard: 40 hrs/week × 52 weeks = 2,080 hrs/year. Part-time or seasonal roles adjust accordingly. Account for unpaid leave when estimating actual income.'
}

export default calcDef
