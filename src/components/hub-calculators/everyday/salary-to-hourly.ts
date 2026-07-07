import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualSalary: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vacationWeeks: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'annualSalary', label: 'Annual Salary ($)', type: 'number', min: 10000, step: '10000' },
    { name: 'hoursPerWeek', label: 'Hours Worked per Week', type: 'number', min: 1, max: 80, step: '5' },
    { name: 'weeksPerYear', label: 'Weeks Worked per Year', type: 'number', min: 1, max: 52, step: '1' },
    { name: 'vacationWeeks', label: 'Paid Vacation Weeks', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const totalWeeks = v.weeksPerYear + v.vacationWeeks
    const hourly = v.annualSalary / (v.hoursPerWeek * totalWeeks)
    const weekly = hourly * v.hoursPerWeek
    const biweekly = weekly * 2
    const monthly = v.annualSalary / 12
    return { result: hourly, label: 'Hourly Equivalent', unit: '$/hr', steps: [{ label: 'Annual Salary', value: `$${v.annualSalary.toFixed(0)}` }, { label: 'Total Hours Worked', value: `${(v.hoursPerWeek * totalWeeks).toFixed(0)} hrs/yr` }, { label: 'Hourly Rate', value: `$${hourly.toFixed(2)}/hr` }, { label: 'Weekly', value: `$${weekly.toFixed(2)}` }, { label: 'Biweekly', value: `$${biweekly.toFixed(2)}` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }] }
  },
  description: 'Convert annual salary to hourly rate including work weeks, vacation, and overtime considerations. See weekly, biweekly, and monthly breakdowns.',
  formula: 'Hourly = Annual / (Hours/Week × TotalWeeks) | TotalWeeks = WorkedWeeks + VacationWeeks',
  interpretation: 'Standard full-time: 40 hrs/week, 52 weeks = 2,080 hrs/yr. Hourly equivalent of $60k salary: $28.85/hr. For contractor rates, add 25-40% for self-employment tax, benefits, and overhead.'
}

export default calcDef
