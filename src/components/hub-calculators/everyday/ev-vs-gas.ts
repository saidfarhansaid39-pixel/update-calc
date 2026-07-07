import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), evKwhPer100: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elecRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'annualMiles', label: 'Annual Miles Driven', type: 'number', min: 1000, step: '1000' },
    { name: 'evKwhPer100', label: 'EV Efficiency (kWh/100mi)', type: 'number', min: 15, step: '5' },
    { name: 'elecRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'gasMpg', label: 'Gas Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'gasPrice', label: 'Gas Price ($/gal)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const evAnnualKwh = (v.annualMiles / 100) * v.evKwhPer100
    const evFuelCost = evAnnualKwh * v.elecRate
    const gasGallons = v.annualMiles / v.gasMpg
    const gasFuelCost = gasGallons * v.gasPrice
    const annualSavings = gasFuelCost - evFuelCost
    const savingsPct = (annualSavings / gasFuelCost) * 100
    return { result: annualSavings, label: 'Annual Fuel Savings', unit: '$', steps: [{ label: 'EV Annual Energy', value: `${evAnnualKwh.toFixed(0)} kWh × $${v.elecRate.toFixed(2)} = $${evFuelCost.toFixed(0)}` }, { label: 'Gas Annual Fuel', value: `${gasGallons.toFixed(0)} gal × $${v.gasPrice.toFixed(2)} = $${gasFuelCost.toFixed(0)}` }, { label: 'Annual Savings with EV', value: `$${annualSavings.toFixed(0)} (${savingsPct.toFixed(0)}% less)` }] }
  },
  description: 'Compare annual fuel costs between an electric vehicle and a gas-powered vehicle. See how much you can save by switching to an EV.',
  formula: 'Savings = (Miles/MPG × Gas Price) - (Miles/100 × kWh/100mi × Elec Rate)',
  interpretation: 'Typical EV efficiency: 30-35 kWh/100mi. At $0.14/kWh and $3.50/gal gas, EV saves ~$1,200/yr vs 25 MPG car. EV maintenance is ~40% lower: no oil changes, fewer brake repairs (regenerative braking).'
}

export default calcDef
