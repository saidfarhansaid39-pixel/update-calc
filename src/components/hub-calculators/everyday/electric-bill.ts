import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ kwhUsed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), baseFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'kwhUsed', label: 'Electricity Used (kWh)', type: 'number', min: 1, step: '50' },
    { name: 'rate', label: 'Rate per kWh ($)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'baseFee', label: 'Monthly Base Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const usageCharge = v.kwhUsed * v.rate
    const subtotal = usageCharge + v.baseFee
    const tax = subtotal * (v.taxRate / 100)
    const total = subtotal + tax
    return { result: total, label: 'Total Electric Bill', unit: '$', steps: [{ label: 'Usage Charge', value: `${v.kwhUsed} kWh × $${v.rate.toFixed(2)} = $${usageCharge.toFixed(2)}` }, { label: 'Base Fee', value: `$${v.baseFee.toFixed(2)}` }, { label: 'Tax', value: `$${tax.toFixed(2)}` }, { label: 'Total Bill', value: `$${total.toFixed(2)}` }] }
  },
  description: 'Calculate your monthly electric bill from kWh usage, rate, base fee, and taxes. Understand how each component contributes to your bill.',
  formula: 'Total = (kWh × Rate) + Base Fee + Tax',
  interpretation: 'Average US residential rate: $0.14-0.17/kWh. Highest: Hawaii ($0.33), California ($0.22). Lowest: Louisiana ($0.10), Idaho ($0.10). Reduce usage by switching to LED bulbs, smart thermostats, and Energy Star appliances.'
}

export default calcDef
