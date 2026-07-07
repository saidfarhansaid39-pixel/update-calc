import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ watts: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hours: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), rate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), days: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'watts', label: 'Appliance Wattage (watts)', type: 'number', min: 1, step: '10' },
    { name: 'hours', label: 'Hours Used Per Day', type: 'number', min: 0.1, step: '0.5' },
    { name: 'rate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'days', label: 'Days Used Per Month', type: 'number', min: 1, max: 31, step: '1' },
  ],
  compute: (v) => {
    const dailyKwh = (v.watts / 1000) * v.hours
    const monthlyKwh = dailyKwh * v.days
    const monthlyCost = monthlyKwh * v.rate
    const annualCost = monthlyCost * 12
    return { result: monthlyCost, label: 'Monthly Cost', unit: '$', steps: [{ label: 'Daily Usage', value: `${dailyKwh.toFixed(3)} kWh` }, { label: 'Monthly Usage', value: `${monthlyKwh.toFixed(1)} kWh` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }] }
  },
  description: 'Calculate the electricity cost of any household appliance based on wattage, daily usage, and your local electric rate.',
  formula: 'Cost = (Watts / 1000) × Hours/Day × Days × Rate/kWh',
  interpretation: 'Common appliances: fridge ~150W ($5-10/month), washer ~500W ($3-8/month), TV ~100W ($2-5/month). Energy Star appliances use 10-50% less.'
}

export default calcDef
