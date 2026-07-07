import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ purchasePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), milesYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insuranceYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), maintenanceYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', min: 1000, step: '1000' },
    { name: 'yearsOwned', label: 'Years Owned', type: 'number', min: 1, max: 20, step: '1' },
    { name: 'milesYear', label: 'Miles Driven per Year', type: 'number', min: 1000, step: '1000' },
    { name: 'fuelMpg', label: 'Average MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelPrice', label: 'Avg Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'insuranceYear', label: 'Annual Insurance ($)', type: 'number', min: 0, step: '200' },
    { name: 'maintenanceYear', label: 'Annual Maintenance ($)', type: 'number', min: 0, step: '100' },
  ],
  compute: (v) => {
    const fuelCostYear = (v.milesYear / v.fuelMpg) * v.fuelPrice
    const annualCost = fuelCostYear + v.insuranceYear + v.maintenanceYear
    const totalCost = v.purchasePrice + annualCost * v.yearsOwned
    const costPerMile = totalCost / (v.milesYear * v.yearsOwned)
    return { result: costPerMile, label: 'Cost per Mile', unit: '$', steps: [{ label: 'Annual Fuel', value: `$${fuelCostYear.toFixed(0)}` }, { label: 'Annual Operating', value: `$${annualCost.toFixed(0)}` }, { label: 'Total Cost of Ownership', value: `$${totalCost.toFixed(0)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(2)}` }] }
  },
  description: 'Calculate the true cost per mile and total cost of owning a car including purchase price, fuel, insurance, and maintenance over the ownership period.',
  formula: 'Cost/Mile = (Purchase + Years×(Fuel + Insurance + Maintenance)) / (Years × Miles/Year)',
  interpretation: 'Average US cost: $0.55-0.65/mile. Fuel is 25-35% of operating cost. Depreciation (not included here) adds $0.15-0.25/mile for new cars. Buy used 2-3 years old to avoid steepest depreciation.'
}

export default calcDef
