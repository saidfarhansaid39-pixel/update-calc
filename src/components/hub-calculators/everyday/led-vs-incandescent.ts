import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bulbCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wattInc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wattLed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ledCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), incCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'bulbCount', label: 'Number of Bulbs', type: 'number', min: 1, step: '1' },
    { name: 'wattInc', label: 'Incandescent Wattage (W)', type: 'number', min: 1, step: '10' },
    { name: 'wattLed', label: 'LED Wattage (W)', type: 'number', min: 1, step: '1' },
    { name: 'hoursPerDay', label: 'Hours On per Day', type: 'number', min: 0, step: '1' },
    { name: 'rate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0, step: '0.01' },
    { name: 'incCost', label: 'Incandescent Bulb Cost ($)', type: 'number', min: 0, step: '1' },
    { name: 'ledCost', label: 'LED Bulb Cost ($)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const dailyKwhInc = (v.wattInc * v.bulbCount * v.hoursPerDay) / 1000; const dailyKwhLed = (v.wattLed * v.bulbCount * v.hoursPerDay) / 1000; const annualKwhInc = dailyKwhInc * 365; const annualKwhLed = dailyKwhLed * 365; const annualCostInc = annualKwhInc * v.rate + v.incCost / 2; const annualCostLed = annualKwhLed * v.rate + v.ledCost / 8; const savings = annualCostInc - annualCostLed; const savingPct = (savings / annualCostInc) * 100; return { result: savings, label: 'Annual Savings with LED', unit: '$', steps: [{ label: 'Incandescent Cost/yr', value: `$${annualCostInc.toFixed(2)}` }, { label: 'LED Cost/yr', value: `$${annualCostLed.toFixed(2)}` }, { label: 'Annual Savings', value: `$${savings.toFixed(2)}` }, { label: 'Savings %', value: `${savingPct.toFixed(1)}%` }] } },
  description: 'Compare LED vs incandescent light bulb costs including energy usage, bulb lifespan, and purchase price to show annual savings.',
  formula: 'Annual Savings = [(IncW × Hrs × 365/1000 × Rate) + BulbCost/2yrs] − [(LEDW × Hrs × 365/1000 × Rate) + BulbCost/8yrs]',
  interpretation: 'LEDs use 75-85% less energy and last 15-25x longer than incandescents. A single LED replacing a 60W incandescent saves $5-10/year. Payback period is typically under 6 months.'
}

export default calcDef
