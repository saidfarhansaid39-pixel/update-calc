import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ currentWatt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), newWatt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bulbCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elecRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'currentWatt', label: 'Current Bulb Wattage', type: 'number', min: 1, step: '10' },
    { name: 'newWatt', label: 'New Bulb Wattage', type: 'number', min: 1, step: '5' },
    { name: 'hoursPerDay', label: 'Hours On Per Day', type: 'number', min: 0.5, step: '1' },
    { name: 'bulbCount', label: 'Number of Bulbs', type: 'number', min: 1, step: '1' },
    { name: 'elecRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const wattSaved = v.currentWatt - v.newWatt
    const dailyKwhSaved = (wattSaved * v.hoursPerDay * v.bulbCount) / 1000
    const annualKwhSaved = dailyKwhSaved * 365
    const annualSavings = annualKwhSaved * v.elecRate
    return { result: annualSavings, label: 'Annual Savings', unit: '$', steps: [{ label: 'Watts Saved per Bulb', value: `${wattSaved} W` }, { label: 'Daily kWh Saved', value: `${dailyKwhSaved.toFixed(3)} kWh` }, { label: 'Annual kWh Saved', value: `${annualKwhSaved.toFixed(0)} kWh` }, { label: 'Annual Cost Savings', value: `$${annualSavings.toFixed(2)}` }] }
  },
  description: 'Calculate annual electricity savings from switching to more energy-efficient light bulbs (e.g., LED vs incandescent).',
  formula: 'Savings = (OldW - NewW) × Hours × Count × 365 / 1000 × Rate',
  interpretation: 'LED bulbs use 75-80% less energy than incandescents and last 15-25× longer. Replacing 10 bulbs can save $100-200/year. $0.12/kWh is US average.'
}

export default calcDef
