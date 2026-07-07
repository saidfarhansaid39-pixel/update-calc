import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amc2TotalWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), amc2DistKm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), amc2Floors: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), amc2HasElevator: z.string().min(1), amc2StorageMonths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amc2TotalWeight', label: 'Estimated Weight (lbs)', type: 'number', min: 500, step: '500' },
    { name: 'amc2DistKm', label: 'Move Distance (miles)', type: 'number', min: 1, step: '25' },
    { name: 'amc2Floors', label: 'Floors (origin)', type: 'number', min: 1, step: '1' },
    { name: 'amc2HasElevator', label: 'Elevator at Origin', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No (stairs fee)', value: 'no' }] },
    { name: 'amc2StorageMonths', label: 'Storage Needed (months)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const weightCost = v.amc2TotalWeight * 0.5
    const distanceCost = v.amc2DistKm * 1.5
    const stairsFee = v.amc2HasElevator === 'no' ? v.amc2Floors * 75 : 0
    const laborBase = v.amc2TotalWeight / 100 * 40
    const storageMonthly = v.amc2StorageMonths * 150
    const packingMaterials = Math.ceil(v.amc2TotalWeight / 1000) * 200
    const subtotal = weightCost + distanceCost + stairsFee + laborBase + storageMonthly + packingMaterials
    const taxPct = 0.07
    const total = subtotal * (1 + taxPct)
    const costPerLb = total / v.amc2TotalWeight
    return { result: total, label: 'Total Moving Estimate', unit: '$', steps: [{ label: 'Weight-Based', value: `$${weightCost.toFixed(0)}` }, { label: 'Distance', value: `$${distanceCost.toFixed(0)}` }, { label: 'Stairs Fee', value: `$${stairsFee.toFixed(0)}` }, { label: 'Labor', value: `$${laborBase.toFixed(0)}` }, { label: 'Packing Materials', value: `$${packingMaterials.toFixed(0)}` }, { label: 'Storage', value: `$${storageMonthly.toFixed(0)}` }, { label: 'Total (incl tax)', value: `$${total.toFixed(0)}` }] }
  },
  description: 'Auto moving cost estimator based on weight, distance, floors, stairs, and storage needs. Get a comprehensive moving budget with all cost factors.',
  formula: 'Total = (Weight × $0.50 + Distance × $1.50 + Stairs + Labor + Packing + Storage) × 1.07',
  interpretation: 'Average household goods weigh 5000-10000 lbs. Movers charge $0.40-0.70/lb for long-distance. Stairs add $50-100 per flight. Storage units cost $100-250/month. Declutter before moving to reduce weight and cost by 20-30%.'
}

export default calcDef
