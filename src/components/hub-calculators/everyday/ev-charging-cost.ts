import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ batteryKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargePct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), electricityRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), chargeFreq: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'batteryKwh', label: 'Battery Capacity (kWh)', type: 'number', min: 10, step: '5' },
    { name: 'chargePct', label: 'Charge From (%)', type: 'number', min: 1, max: 100, step: '5' },
    { name: 'electricityRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'chargeFreq', label: 'Charges per Week', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const kwhPerCharge = v.batteryKwh * (v.chargePct / 100)
    const costPerCharge = kwhPerCharge * v.electricityRate
    const weeklyCost = costPerCharge * v.chargeFreq
    const monthlyCost = weeklyCost * 4.33
    const annualCost = weeklyCost * 52
    return { result: monthlyCost, label: 'Monthly Charging Cost', unit: '$', steps: [{ label: 'Energy per Charge', value: `${kwhPerCharge.toFixed(1)} kWh` }, { label: 'Cost per Charge', value: `$${costPerCharge.toFixed(2)}` }, { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }] }
  },
  description: 'Calculate the cost to charge your electric vehicle at home. Enter battery size, charge percentage, electricity rate, and charging frequency.',
  formula: 'Cost = Battery(kWh) × Charge% × Rate($/kWh) × Frequency',
  interpretation: 'At $0.14/kWh, charging a 75 kWh EV from 20-80% costs ~$6.30. That is the equivalent of spending $0.84/gal for gas (at 30 MPG). Time-of-use plans can cut charging costs by 30-50%.'
}

export default calcDef
