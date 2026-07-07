import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ acPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), hoursPerDay: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), ratePerKwh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'acPower', label: 'AC Power (watts)', type: 'number', min: 500, step: '100' },
    { name: 'hoursPerDay', label: 'Hours Used Per Day', type: 'number', min: 0.5, step: '0.5' },
    { name: 'ratePerKwh', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const dailyKwh = (v.acPower / 1000) * v.hoursPerDay
    const dailyCost = dailyKwh * v.ratePerKwh
    const monthlyCost = dailyCost * 30
    return { result: monthlyCost, label: 'Monthly Cost', unit: '$', steps: [{ label: 'Daily Consumption', value: `${dailyKwh.toFixed(2)} kWh` }, { label: 'Daily Cost', value: `$${dailyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }] }
  },
  description: 'Calculate the monthly operating cost of an air conditioner based on power rating, usage hours, and local electricity rate.',
  formula: 'Monthly Cost = (Watts / 1000) × Hours/Day × Rate × 30',
  interpretation: 'Central AC (3000-5000W) costs $30-90/month. Window units (500-1500W) cost $10-40/month. Set thermostat 2°F higher to save ~10%.'
}

export default calcDef
