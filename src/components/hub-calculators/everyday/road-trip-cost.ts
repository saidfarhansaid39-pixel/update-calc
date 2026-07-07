import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), vehicleMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tolls: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), maintenancePerMile: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalMiles', label: 'Total Miles', type: 'number', min: 50, step: '50' },
    { name: 'vehicleMpg', label: 'Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelPrice', label: 'Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'tolls', label: 'Total Tolls ($)', type: 'number', min: 0, step: '5' },
    { name: 'maintenancePerMile', label: 'Maintenance per Mile ($)', type: 'number', min: 0, step: '0.01' },
  ],
  compute: (v) => {
    const fuelCost = (v.totalMiles / v.vehicleMpg) * v.fuelPrice
    const maintCost = v.totalMiles * v.maintenancePerMile
    const total = fuelCost + v.tolls + maintCost
    const costPerMile = total / v.totalMiles
    return { result: total, label: 'Total Driving Cost', unit: '$', steps: [{ label: 'Fuel Cost', value: `$${fuelCost.toFixed(2)}` }, { label: 'Maintenance', value: `$${maintCost.toFixed(2)}` }, { label: 'Tolls', value: `$${v.tolls.toFixed(2)}` }, { label: 'Total', value: `$${total.toFixed(2)}` }, { label: 'Cost per Mile', value: `$${costPerMile.toFixed(3)}` }] }
  },
  description: 'Calculate road trip driving costs including fuel, tolls, and vehicle maintenance. Get the true cost per mile for your trip.',
  formula: 'Total = (Miles/MPG×FuelPrice) + Tolls + (Miles×MaintPerMile)',
  interpretation: 'IRS standard mileage rate: $0.655/mi (2024) covers gas, maintenance, depreciation. Your actual fuel-only cost is typically $0.10-0.20/mi. Tolls can add $20-100+ on routes with toll roads. Plan around toll-free alternatives.'
}

export default calcDef
