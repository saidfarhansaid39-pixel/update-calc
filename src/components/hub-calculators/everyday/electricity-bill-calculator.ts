import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ kwhUsedMonthly: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ratePerKwh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), serviceFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxPercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'kwhUsedMonthly', label: 'Monthly kWh Usage', type: 'number', min: 1, step: '50' },
    { name: 'ratePerKwh', label: 'Rate per kWh ($)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'serviceFee', label: 'Monthly Service Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'taxPercent', label: 'Tax Rate (%)', type: 'number', min: 0, step: '0.5' },
  ],
  compute: (v) => {
    const usageCharge = v.kwhUsedMonthly * v.ratePerKwh
    const subtotal = usageCharge + v.serviceFee
    const taxes = subtotal * (v.taxPercent / 100)
    const total = subtotal + taxes
    return { result: total, label: 'Total Electric Bill', unit: '$', steps: [{ label: 'Usage Charge', value: `${v.kwhUsedMonthly} kWh × $${v.ratePerKwh.toFixed(3)} = $${usageCharge.toFixed(2)}` }, { label: 'Service Fee', value: `$${v.serviceFee.toFixed(2)}` }, { label: 'Taxes', value: `$${taxes.toFixed(2)}` }, { label: 'Total Bill', value: `$${total.toFixed(2)}` }] }
  },
  description: 'Calculate your monthly electricity bill from kWh usage, rate per kWh, service fees, and applicable taxes.',
  formula: 'Total = (kWh × Rate) + Service Fee + Taxes',
  interpretation: 'Average US household uses ~900 kWh/month. Heating/cooling accounts for 50% of usage. Time-of-use rates can save 10-30% by shifting usage to off-peak hours.'
}

export default calcDef
