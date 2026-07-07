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
  compute: (v) => {
    const startTotal = v.whStartHour * 60 + v.whStartMin
    const endTotal = v.whEndHour * 60 + v.whEndMin
    let workedMin = endTotal - startTotal
    if (workedMin < 0) workedMin += 1440
    const breakMin = v.whBreakMin
    const netMin = workedMin - breakMin
    const hoursWorked = netMin / 60
    const earnings = hoursWorked * v.whHourlyRate
    return { result: hoursWorked, label: 'Hours Worked', unit: 'hrs', steps: [{ label: 'Time Range', value: v.whStartHour + ':' + v.whStartMin.toString().padStart(2, '0') + ' - ' + v.whEndHour + ':' + v.whEndMin.toString().padStart(2, '0') }, { label: 'Gross Time', value: workedMin + ' min (' + (workedMin / 60).toFixed(2) + ' hrs)' }, { label: 'Break', value: '-' + breakMin + ' min' }, { label: 'Net Hours', value: hoursWorked.toFixed(2) + ' hrs' }, { label: 'Earnings', value: '$' + earnings.toFixed(2) }] }
  },
  description: 'Track work hours and calculate earnings. Enter start/end times and break duration to see net hours and pay.',
  formula: 'Hours = (EndTime - StartTime - Break) / 60 | Earnings = Hours x HourlyRate | Supports overnight shifts (end < start)',
  interpretation: 'Standard 8-hour workday with 30-60 min lunch break = 7-7.5 billable hours. Activities exceeding 10 min must be paid under FLSA. Take breaks every 2 hours for maximum productivity. Track time in 6-minute increments (0.1 hr).'
}

export default calcDef
