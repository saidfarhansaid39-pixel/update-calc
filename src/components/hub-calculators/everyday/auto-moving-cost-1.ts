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
  defaults: { amc2TotalWeight: '5000', amc2DistKm: '50', amc2Floors: '2', amc2HasElevator: 'no', amc2StorageMonths: '0' },
  presets: [
    { label: 'Studio Apartment', values: { amc2TotalWeight: '2000', amc2DistKm: '10', amc2Floors: '3', amc2HasElevator: 'no', amc2StorageMonths: '0' } },
    { label: '3BR House Long-Distance', values: { amc2TotalWeight: '8000', amc2DistKm: '500', amc2Floors: '1', amc2HasElevator: 'yes', amc2StorageMonths: '1' } },
    { label: '2BR With Storage', values: { amc2TotalWeight: '5000', amc2DistKm: '100', amc2Floors: '2', amc2HasElevator: 'no', amc2StorageMonths: '3' } },
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
    return { result: total, label: 'Total Moving Estimate', unit: '$', steps: [{ label: 'Weight Cost', value: `${v.amc2TotalWeight} lbs × $0.50 = $${weightCost.toFixed(0)}` }, { label: 'Distance Cost', value: `${v.amc2DistKm} mi × $1.50 = $${distanceCost.toFixed(0)}` }, { label: 'Stairs Fee', value: `${v.amc2Floors} floors × $75 = $${stairsFee.toFixed(0)}` }, { label: 'Labor (load/unload)', value: `${v.amc2TotalWeight} / 100 × $40 = $${laborBase.toFixed(0)}` }, { label: 'Packing Materials', value: `~${Math.ceil(v.amc2TotalWeight / 1000)} sets × $200 = $${packingMaterials.toFixed(0)}` }, { label: 'Storage', value: `${v.amc2StorageMonths} mo × $150 = $${storageMonthly.toFixed(0)}` }, { label: 'Tax (7%)', value: `$${(subtotal * taxPct).toFixed(0)}` }, { label: 'Total Estimate', value: `$${total.toFixed(0)} ($${costPerLb.toFixed(2)}/lb)` }] ,
    extras: [
      { label: 'Weight Reduction = Direct Savings', value: `At $${costPerLb.toFixed(2)}/lb all-in, every 100 lbs you declutter saves ~$${(100 * costPerLb).toFixed(0)}. A typical household can shed 500-1000 lbs before moving — saving $${(750 * costPerLb).toFixed(0)}-$${(1000 * costPerLb).toFixed(0)}.` },
      { label: 'Stair vs Elevator Impact', value: `${v.amc2HasElevator === 'no' ? 'No elevator + ' + v.amc2Floors + ' flights adds $' + stairsFee.toFixed(0) + ' in stair fees. Each flight over 2 costs an extra $75-100. If the destination also has stairs, expect another $' + (v.amc2Floors * 50).toFixed(0) + '-' + (v.amc2Floors * 75).toFixed(0) + '.' : 'Elevator access saves $' + (v.amc2Floors * 75).toFixed(0) + ' in stair fees. Book the elevator in advance to avoid wait times.'}` },
      { label: 'DIY vs Professional', value: `Your estimate: $${total.toFixed(0)} with movers. Renting a truck ($${Math.round(v.amc2DistKm * 0.8)}+ fuel) + doing it yourself costs ~50-60% less but requires ${Math.ceil(v.amc2TotalWeight / 1000)} trips and multiple helpers. Break-even: if your time is worth >$${(total * 0.5 / (v.amc2TotalWeight / 1000 * 4)).toFixed(0)}/hr, hire movers.` },
      { label: 'Packing Supply Hack', value: `Packing materials cost ~$${packingMaterials.toFixed(0)}. Get free boxes from liquor stores, grocery stores, and Facebook Marketplace. Buy only specialty boxes (wardrobe, dish) at ~$15-25 each. Using free boxes saves $${(packingMaterials * 0.5).toFixed(0)}-$${(packingMaterials * 0.7).toFixed(0)}.` },
      { label: 'Storage Unit Economics', value: `${v.amc2StorageMonths > 0 ? v.amc2StorageMonths + ' months storage at $150/mo = $' + storageMonthly.toFixed(0) + '. Often cheaper to sell items and rebuy than store long-term. Calculate: if stored item value < $' + (150 * v.amc2StorageMonths).toFixed(0) + ', sell it.' : 'No storage needed — smart. If downsizing, consider that a 10×10 storage unit ($100-250/mo) for 3 months costs $300-750 — often more than the stored items are worth.'}` },
      { label: 'Seasonal Pricing', value: 'Summer (May-Sept) moves cost 20-30% more. Winter moves are cheaper but risk weather delays. Booking 4-6 weeks ahead saves 10-15% vs last-minute. Your $' + `${total.toFixed(0)}` + ' estimate could be $' + `${(total * 0.85).toFixed(0)}` + ' with off-peak + early booking.' },
      { label: 'Insurance Consideration', value: `Basic valuation is included ($0.60/lb). Full-value protection costs ~1-2% of declared value. For $${total.toFixed(0)} of goods, that is ~$${(total * 0.015).toFixed(0)} extra — worth it for electronics, antiques, and fragile items.` },
    ]}
  },
  description: 'Comprehensive auto moving cost estimator based on total weight, distance, number of floors, elevator access, and storage needs. Includes packing materials, labor, and tax for a realistic budget.',
  formula: 'Total = (Weight × $0.50 + Distance × $1.50/mi + Stairs Fee + Labor + Packing + Storage) × 1.07 | Labor = Weight ÷ 100 × $40 | Packing = Ceil(Weight ÷ 1000) × $200',
  interpretation: 'A typical 3BR household (5,000-8,000 lbs) moving 50 miles costs $2,500-4,500 with professional movers. Weight ($0.50/lb) and labor ($40/100 lbs) are the largest cost drivers — decluttering 1,000 lbs saves $500-700. Stairs add $50-75 per flight if no elevator. Storage ($150/month) is rarely worth it for long-term. Booking 4-6 weeks ahead and moving in winter saves 20-30%. Consider DIY for local moves under 50 miles and under 3,000 lbs.'
}

export default calcDef
