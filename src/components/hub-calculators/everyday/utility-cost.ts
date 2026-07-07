import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ucElectricKwh: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucElectricRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucGasTherms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucGasRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucWaterGal: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucWaterRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'ucElectricKwh', label: 'Electricity Usage (kWh)', type: 'number', min: 0, step: '50' },
    { name: 'ucElectricRate', label: 'Electric Rate ($/kWh)', type: 'number', min: 0, step: '0.02' },
    { name: 'ucGasTherms', label: 'Gas Usage (therms)', type: 'number', min: 0, step: '10' },
    { name: 'ucGasRate', label: 'Gas Rate ($/therm)', type: 'number', min: 0, step: '0.5' },
    { name: 'ucWaterGal', label: 'Water Usage (gallons)', type: 'number', min: 0, step: '1000' },
    { name: 'ucWaterRate', label: 'Water Rate ($/1000 gal)', type: 'number', min: 0, step: '2' },
  ],
  compute: (v) => {
    const electricCost = v.ucElectricKwh * v.ucElectricRate
    const gasCost = v.ucGasTherms * v.ucGasRate
    const waterCost = v.ucWaterGal / 1000 * v.ucWaterRate
    const total = electricCost + gasCost + waterCost
    return { result: total, label: 'Total Utility Cost', unit: '$', steps: [{ label: 'Electric', value: v.ucElectricKwh + ' kWh x $' + v.ucElectricRate.toFixed(3) + ' = $' + electricCost.toFixed(2) }, { label: 'Gas', value: v.ucGasTherms + ' therms x $' + v.ucGasRate.toFixed(2) + ' = $' + gasCost.toFixed(2) }, { label: 'Water', value: v.ucWaterGal.toFixed(0) + ' gal x $' + v.ucWaterRate.toFixed(2) + '/kgal = $' + waterCost.toFixed(2) }, { label: 'Total', value: '$' + total.toFixed(2) }] }
  },
  description: 'Calculate total utility costs from electric, gas, and water usage with per-unit rates. Great for budgeting and usage tracking.',
  formula: 'Total = kWh x Rate + Therms x Rate + (Gal/1000) x Rate | Average US: 900 kWh, 40 therms, 3,000 gal/month',
  interpretation: 'Average US monthly utilities: electric $120, gas $70, water $40 = $230 total. Electricity is typically 50-60% of the bill. Heating season (winter) doubles gas usage. Reduce by 10-20% with efficient appliances.'
}

export default calcDef
