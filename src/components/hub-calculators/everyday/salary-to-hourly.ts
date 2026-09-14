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
  defaults: { annualSalary: '60000', hoursPerWeek: '40', weeksPerYear: '50', vacationWeeks: '2' },
  presets: [
    { label: 'Standard Full-Time', values: { annualSalary: '60000', hoursPerWeek: '40', weeksPerYear: '52', vacationWeeks: '0' } },
    { label: 'Salaried with Vacation', values: { annualSalary: '75000', hoursPerWeek: '40', weeksPerYear: '48', vacationWeeks: '4' } },
    { label: 'Freelance Contractor', values: { annualSalary: '100000', hoursPerWeek: '35', weeksPerYear: '44', vacationWeeks: '0' } },
    { label: 'Part-Time Parent', values: { annualSalary: '35000', hoursPerWeek: '25', weeksPerYear: '48', vacationWeeks: '2' } },
  ],
  compute: (v) => {
    const totalWeeks = v.weeksPerYear + v.vacationWeeks
    const hourly = v.annualSalary / (v.hoursPerWeek * totalWeeks)
    const weekly = hourly * v.hoursPerWeek
    const biweekly = weekly * 2
    const monthly = v.annualSalary / 12
    return { result: hourly, label: 'Hourly Equivalent', unit: '$/hr', steps: [{ label: 'Annual Salary', value: `$${v.annualSalary.toFixed(0)}` }, { label: 'Total Hours Worked', value: `${(v.hoursPerWeek * totalWeeks).toFixed(0)} hrs/yr` }, { label: 'Hourly Rate', value: `$${hourly.toFixed(2)}/hr` }, { label: 'Weekly', value: `$${weekly.toFixed(2)}` }, { label: 'Biweekly', value: `$${biweekly.toFixed(2)}` }, { label: 'Monthly', value: `$${monthly.toFixed(2)}` }] ,
    extras: [
      { label: 'Standard VS Actual Hours', value: 'Standard calculation: 2,080 hrs/yr (40 hrs × 52 wks). Actual: subtract unpaid breaks, account for overtime. A 50-hr work week at same salary = 26% lower hourly rate' },
      { label: 'Contractor Rate Multiplier', value: 'Contractors need 25-40% more than hourly equivalent. Self-employment tax (15.3%), no PTO (6-7%), no health insurance ($500-1,200/mo), no 401k match (3-6%)' },
      { label: 'Overtime Impact', value: 'Salaried exempt employees work 45-50 hrs/week on average. A $70k salary at 45 hrs vs 40 hrs = $33.65/hr vs $37.50/hr effective rate — $3.85/hr less for the same pay' },
      { label: 'Benefits Value', value: 'Benefits add 30-40% to total compensation: health insurance $500-1,200/mo, 401k match 3-6% ($1,800-3,600/yr), PTO 10-20 days, sick leave, life insurance' },
      { label: 'Minimum Wage Comparison', value: 'US federal minimum wage: $7.25/hr ($15,080/yr at 40 hrs × 52 wks). Living wage (single adult, no kids): $17-25/hr depending on location. $60k salary = $28.85/hr' },
      { label: 'Salary Negotiation Prep', value: 'Use hourly rate to compare job offers. A $65k job at 50 hrs/week = $25/hr vs $60k at 40 hrs/week = $28.85/hr — the lower salary pays 15% more per hour' },
      { label: 'Geographic Adjustments', value: 'Same salary buys different lifestyle: $60k in San Francisco = $30k in Wichita after cost-of-living adjustment. Use locality pay calculators for accurate comparisons' },
    ]}
  },
  description: 'Convert annual salary to hourly rate, plus see weekly, biweekly, and monthly breakdowns. Account for vacation weeks, actual hours worked, and paid time off.',
  formula: 'HourlyRate = AnnualSalary ÷ (HoursPerWeek × TotalWeeks). TotalWeeks = WeeksWorked + VacationWeeks. Weekly = Hourly × HoursPerWeek. Biweekly = Weekly × 2. Monthly = Annual ÷ 12.',
  interpretation: 'A $60,000 annual salary at 40 hrs/week, 50 weeks worked + 2 weeks vacation = 2,080 total hours/year = $28.85/hr. Important context: the "standard" 2,080-hr year assumes no unpaid leave. Many salaried employees work 45-50 hours per week, reducing effective hourly rate by 11-25%. For contractors, add 25-40% to cover self-employment tax (15.3%), health insurance ($6,000-14,400/yr), no PTO, and no retirement match. Benefits typically add 30-40% to total compensation value beyond salary. Use the hourly rate to compare jobs with different hours or benefits packages.'
}

export default calcDef
