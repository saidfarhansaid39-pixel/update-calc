import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    day1: z.string().optional(),
    day2: z.string().optional(),
    day3: z.string().optional(),
    day4: z.string().optional(),
    day5: z.string().optional(),
    day6: z.string().optional(),
    day7: z.string().optional()
}),
  fields: [
    { name: 'day1', label: 'Monday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day2', label: 'Tuesday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day3', label: 'Wednesday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day4', label: 'Thursday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day5', label: 'Friday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day6', label: 'Saturday', type: 'number', unit: 'km', min: 0, step: '0.1' },
    { name: 'day7', label: 'Sunday', type: 'number', unit: 'km', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const total = (v.day1 || 0) + (v.day2 || 0) + (v.day3 || 0) + (v.day4 || 0) + (v.day5 || 0) + (v.day6 || 0) + (v.day7 || 0)
    const daysRun = [v.day1, v.day2, v.day3, v.day4, v.day5, v.day6, v.day7].filter(d => (d || 0) > 0).length
    const avg = daysRun > 0 ? total / daysRun : 0
    return {
      result: total, label: 'Weekly Mileage', unit: 'km',
      steps: [
        { label: 'Total distance', value: `${total.toFixed(1)} km` },
        { label: 'Days run', value: `${daysRun} days` },
        { label: 'Average per run', value: `${avg.toFixed(1)} km` },
        { label: 'Weekly miles', value: `${(total * 0.6214).toFixed(1)} mi` },
        { label: 'Weekly volume category', value: total < 20 ? 'Low' : total < 40 ? 'Moderate' : total < 60 ? 'High' : 'Very High' },
      ]
}
  },
  description: 'Track your weekly running mileage. Log distance for each day of the week to monitor training volume, consistency, and progression over time.'
}

export default calcDef
