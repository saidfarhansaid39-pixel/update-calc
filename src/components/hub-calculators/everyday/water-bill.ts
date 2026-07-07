import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbUsage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbUnit: z.string().min(1), wbRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbBaseFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbSewerPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wbUsage', label: 'Water Usage', type: 'number', min: 1, step: '100' },
    { name: 'wbUnit', label: 'Usage Unit', type: 'select', options: [{ label: 'Gallons', value: 'gal' }, { label: 'Cubic Feet (CCF)', value: 'ccf' }, { label: 'Liters', value: 'L' }, { label: 'Cubic Meters', value: 'm3' }] },
    { name: 'wbRate', label: 'Rate per 1000 Units ($)', type: 'number', min: 0.5, step: '1' },
    { name: 'wbBaseFee', label: 'Base/Meter Fee ($)', type: 'number', min: 0, step: '5' },
    { name: 'wbSewerPct', label: 'Sewer (% of Water Used)', type: 'number', min: 0, max: 100, step: '10' },
  ],
  compute: (v) => {
    const unitConversions: Record<string, number> = { gal: 1000, ccf: 1, L: 1000, m3: 1 }
    const unitsInBilling = v.wbUsage / (unitConversions[v.wbUnit] || 1000)
    const waterCharge = unitsInBilling * v.wbRate
    const sewerCharge = waterCharge * (v.wbSewerPct / 100)
    const total = waterCharge + sewerCharge + v.wbBaseFee
    return { result: total, label: 'Total Water Bill', unit: '$', steps: [{ label: 'Usage', value: v.wbUsage + ' ' + v.wbUnit + ' = ' + unitsInBilling.toFixed(2) + ' billing units' }, { label: 'Water Charge', value: '$' + waterCharge.toFixed(2) }, { label: 'Sewer Charge', value: '$' + sewerCharge.toFixed(2) }, { label: 'Base Fee', value: '$' + v.wbBaseFee.toFixed(2) }, { label: 'Total Bill', value: '$' + total.toFixed(2) }] }
  },
  description: 'Calculate your monthly water bill based on usage, rate, base fee, and sewer charges. Supports gallons, CCF, liters, and cubic meters.',
  formula: 'Bill = (Usage/BillingUnit x Rate) + (Water x Sewer%) + BaseFee | 1 CCF = 748 gal | Avg: 3,000 gal/month',
  interpretation: 'Average US household: 3,000 gal/month (~4 CCF) at $5-15/CCF plus $20-40 base fee. Sewer typically 50-100% of water charge. Total: $40-80/month. Low-flow fixtures reduce usage 20-40%. Check for leaks to avoid high bills.'
}

export default calcDef
