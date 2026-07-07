import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ days: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dailyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insuranceTotal: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fuelCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'days', label: 'Rental Days', type: 'number', min: 1, step: '1' },
    { name: 'dailyRate', label: 'Daily Rate ($)', type: 'number', min: 10, step: '10' },
    { name: 'insuranceTotal', label: 'Total Insurance ($)', type: 'number', min: 0, step: '20' },
    { name: 'fees', label: 'Fees & Taxes ($)', type: 'number', min: 0, step: '10' },
    { name: 'fuelCost', label: 'Fuel Cost ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => {
    const baseRental = v.days * v.dailyRate
    const totalCost = baseRental + v.insuranceTotal + v.fees + v.fuelCost
    const costPerDay = totalCost / v.days
    return { result: totalCost, label: 'Total Rental Cost', unit: '$', steps: [{ label: 'Base Rental', value: `$${baseRental.toFixed(2)}` }, { label: 'Insurance', value: `$${v.insuranceTotal.toFixed(2)}` }, { label: 'Fees & Taxes', value: `$${v.fees.toFixed(2)}` }, { label: 'Fuel', value: `$${v.fuelCost.toFixed(2)}` }, { label: 'Total', value: `$${totalCost.toFixed(2)}` }, { label: 'Cost per Day', value: `$${costPerDay.toFixed(2)}` }] }
  },
  description: 'Calculate total rental car cost including daily rate, insurance, fees, and fuel. Compare total cost across rental companies.',
  formula: 'Total = (Days×DailyRate) + Insurance + Fees + Fuel',
  interpretation: 'Rental companies often add 20-40% in fees above the base rate. Decline CDW insurance if your personal auto policy or credit card offers coverage. Off-airport locations are usually 20-30% cheaper.'
}

export default calcDef
