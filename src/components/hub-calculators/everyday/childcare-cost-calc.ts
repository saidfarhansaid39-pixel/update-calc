import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ children: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'children', label: 'Number of Children', type: 'number', min: 1, step: '1' },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 5, step: '5' },
    { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', min: 1, step: '5' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, max: 52, step: '1' },
  ],
  compute: (v) => {
    const weeklyCost = v.children * v.hourlyRate * v.hoursPerWeek
    const monthlyCost = weeklyCost * 4.33
    const annualCost = weeklyCost * v.weeksPerYear
    return { result: monthlyCost, label: 'Monthly Care Cost', unit: '$', steps: [{ label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }] }
  },
  description: 'Estimate childcare costs based on hourly rate, hours per week, number of children, and weeks per year.',
  formula: 'Cost = Children × Rate/hr × Hours/Week × Weeks',
  interpretation: 'Nanny rates average $15-25/hr depending on location. Daycare centers are typically $200-400/week per child. Many employers offer dependent care FSAs allowing up to $5,000 pre-tax.'
}

export default calcDef
