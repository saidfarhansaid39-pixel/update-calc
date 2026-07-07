import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bagCarryOn: z.string().min(1), bagChecked: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), bagWeightLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bagAirline: z.string().min(1), bagPassengers: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'bagCarryOn', label: 'Carry-On Policy', type: 'select', options: [{ label: 'Personal Item Only', value: 'personal' }, { label: '1 Carry-On + Personal', value: 'standard' }, { label: '2 Carry-On Items', value: 'two' }] },
    { name: 'bagChecked', label: 'Checked Bags (total)', type: 'number', min: 0, step: '1' },
    { name: 'bagWeightLb', label: 'Heaviest Bag Weight (lbs)', type: 'number', min: 10, step: '5' },
    { name: 'bagAirline', label: 'Airline', type: 'select', options: [{ label: 'Spirit/Frontier', value: 'ultra' }, { label: 'United/Delta/American', value: 'legacy' }, { label: 'Southwest', value: 'southwest' }, { label: 'International', value: 'intl' }] },
    { name: 'bagPassengers', label: 'Passengers', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const weightLimit = 50
    let overweightFee = 0
    if (v.bagWeightLb > weightLimit) { overweightFee = Math.ceil((v.bagWeightLb - weightLimit) / 10) * 50 }
    const bagFees: Record<string, { first: number; second: number }> = { ultra: { first: 40, second: 55 }, legacy: { first: 35, second: 45 }, southwest: { first: 0, second: 0 }, intl: { first: 0, second: 100 } }
    const fee = bagFees[v.bagAirline] || bagFees.legacy
    let checkedFees = 0
    let remaining = v.bagChecked
    if (v.bagAirline !== 'southwest' && v.bagAirline !== 'intl') {
      if (remaining > 0) { checkedFees += fee.first; remaining -= 1 }
      if (remaining > 0) { checkedFees += fee.second * remaining }
    } else if (v.bagAirline === 'intl') {
      if (remaining > 1) { checkedFees += (remaining - 1) * fee.second }
    }
    const totalFees = (checkedFees + overweightFee) * v.bagPassengers
    return { result: totalFees, label: 'Total Baggage Fees', unit: '$', steps: [{ label: 'Checked Bag Fee', value: '$' + checkedFees.toFixed(2) }, { label: 'Overweight Fee', value: '$' + overweightFee.toFixed(2) }, { label: 'Per Passenger', value: '$' + (checkedFees + overweightFee).toFixed(2) }, { label: 'Total (x' + v.bagPassengers + ' pax)', value: '$' + totalFees.toFixed(2) }] }
  },
  description: 'Calculate airline baggage fees including carry-on policies, checked bags, overweight charges, and passenger count.',
  formula: 'Fees = CheckedBags x Rate + OverweightPenalty | Southwest: 2 free bags | Ultra-low: $40-55 per bag',
  interpretation: 'Ultra-low carriers charge $35-60 for carry-on AND checked bags. Legacies: $35-45 first checked bag. Southwest: 2 free checked bags. Overweight (51-70lb): $50-100. Avoid fees with airline credit cards.'
}

export default calcDef
