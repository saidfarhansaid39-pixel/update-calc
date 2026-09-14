import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ whStartHour: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), whStartMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), whEndHour: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), whEndMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), whBreakMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), whHourlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'whStartHour', label: 'Start Hour (0-23)', type: 'number', min: 0, max: 23, step: '1' },
    { name: 'whStartMin', label: 'Start Minute', type: 'number', min: 0, max: 59, step: '5' },
    { name: 'whEndHour', label: 'End Hour (0-23)', type: 'number', min: 0, max: 23, step: '1' },
    { name: 'whEndMin', label: 'End Minute', type: 'number', min: 0, max: 59, step: '5' },
    { name: 'whBreakMin', label: 'Break Duration (min)', type: 'number', min: 0, step: '5' },
    { name: 'whHourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { whStartHour: '9', whStartMin: '0', whEndHour: '17', whEndMin: '0', whBreakMin: '30', whHourlyRate: '25' },
  presets: [
    { label: 'Standard Workday (9-5)', values: { whStartHour: '9', whStartMin: '0', whEndHour: '17', whEndMin: '0', whBreakMin: '30', whHourlyRate: '25' } },
    { label: 'Overnight Shift', values: { whStartHour: '22', whStartMin: '0', whEndHour: '6', whEndMin: '0', whBreakMin: '45', whHourlyRate: '30' } },
    { label: 'Part-Time Evening', values: { whStartHour: '14', whStartMin: '0', whEndHour: '18', whEndMin: '30', whBreakMin: '15', whHourlyRate: '20' } },
    { label: 'Long Freelance Day', values: { whStartHour: '8', whStartMin: '0', whEndHour: '19', whEndMin: '0', whBreakMin: '60', whHourlyRate: '50' } },
  ],
  compute: (v) => {
    const startTotal = v.whStartHour * 60 + v.whStartMin
    const endTotal = v.whEndHour * 60 + v.whEndMin
    let workedMin = endTotal - startTotal
    if (workedMin < 0) workedMin += 1440
    const breakMin = v.whBreakMin
    const netMin = workedMin - breakMin
    const hoursWorked = netMin / 60
    const earnings = hoursWorked * v.whHourlyRate
    return { result: hoursWorked, label: 'Hours Worked', unit: 'hrs', steps: [{ label: 'Start Time', value: `${v.whStartHour}:${v.whStartMin.toString().padStart(2, '0')}` }, { label: 'End Time', value: `${v.whEndHour}:${v.whEndMin.toString().padStart(2, '0')}` }, { label: 'Gross Duration', value: `${workedMin} min = ${(workedMin / 60).toFixed(2)} hrs` }, { label: 'Subtract Break', value: `-${breakMin} min = -${(breakMin / 60).toFixed(2)} hrs` }, { label: 'Net Hours Worked', value: `${hoursWorked.toFixed(2)} hrs` }, { label: 'Hourly Rate', value: `$${v.whHourlyRate.toFixed(2)}/hr` }, { label: 'Gross Earnings', value: `${hoursWorked.toFixed(2)} × $${v.whHourlyRate.toFixed(2)} = $${earnings.toFixed(2)}` }, { label: 'Net Pay (after break deduction)', value: `$${earnings.toFixed(2)} for ${hoursWorked.toFixed(2)} hrs` }] ,
    extras: [
      { label: 'FLSA Break Rules', value: 'Under federal law (FLSA), short breaks (≤20 min) must be paid. Meal breaks (≥30 min) can be unpaid if the employee is fully relieved of duties. Activities exceeding 10 min that require work must be paid.' },
      { label: 'Overtime Calculations', value: 'FLSA requires overtime pay at 1.5× regular rate for hours worked beyond 40 per week. Some states (CA, NY) mandate daily overtime for >8 hrs. Track weekly totals to ensure proper overtime compensation.' },
      { label: 'Time Tracking Methods', value: '6-minute (0.1 hr) increments are standard for payroll. Rounding to the nearest quarter-hour is legal if done neutrally. Apps like Toggl, Clockify, and Harvest track automatically. Paper timesheets require meticulous recording.' },
      { label: 'Breaks & Productivity', value: 'The Pomodoro method: 25 min work + 5 min break improves focus. Take a 15-20 min break every 2 hours to maintain cognitive performance. Lunch breaks of 30-60 min midpoint boost afternoon productivity by 19%.' },
      { label: 'Freelance Hourly Rates', value: 'Set your freelance rate using: DesiredSalary / (BillableHoursYear) × 1.3 (for taxes). Target 1,500-1,800 billable hours/year (vs 2,080 total). The rest goes to admin, marketing, and professional development.' },
      { label: 'Weekly & Monthly Tracking', value: 'A standard 40-hr week yields 2,080 annual hours. Subtract 2 weeks vacation, 10 holidays, 5 sick days = 1,880 working hours. For freelancers: 5 hrs billable per 8-hr day is a healthy ratio (62.5% utilization).' },
      { label: 'Tax Withholding Notes', value: 'Employers withhold 7.65% FICA (Social Security + Medicare). Freelancers pay 15.3% self-employment tax on net earnings. Set aside 25-30% of freelance income for federal + state taxes. Quarterly estimated payments required above $1,000 owed.' },
    ]}
  },
  description: 'Track work hours and calculate earnings for hourly employees and freelancers. Enter start/end times (supports overnight shifts) and break duration to see net hours, gross pay, and time breakdowns.',
  formula: 'GrossMinutes = EndTime - StartTime (add 1,440 if end < start for overnight). NetMinutes = GrossMinutes - BreakMinutes. HoursWorked = NetMinutes ÷ 60. GrossPay = HoursWorked × HourlyRate. Earnings calculated before tax and deductions.',
  interpretation: 'A standard 9-to-5 workday with a 30-min unpaid lunch = 7.5 billable hours. At $25/hr, that is $187.50/day or $937.50/week (before tax). The Fair Labor Standards Act (FLSA) requires overtime (>40 hrs/week) at 1.5× the regular rate. For freelancers, consider that only 60-70% of working hours are typically billable — the rest goes to admin, marketing, and breaks. Always track time in consistent increments to ensure accurate payroll and compliance with labor laws.'
}

export default calcDef
