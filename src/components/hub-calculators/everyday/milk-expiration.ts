import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ purchaseDate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), milkType: z.string().min(1), storageTemp: z.string().min(1), sellByDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'purchaseDate', label: 'Days Since Purchase', type: 'number', min: 0, step: '1' },
    { name: 'milkType', label: 'Milk Type', type: 'select', options: [{ label: 'Whole Milk', value: 'whole' }, { label: '2% Reduced Fat', value: 'reduced' }, { label: 'Skim/Fat-Free', value: 'skim' }, { label: 'Lactose-Free', value: 'lactose' }, { label: 'Almond/Oat Milk', value: 'plant' }] },
    { name: 'storageTemp', label: 'Storage Temperature', type: 'select', options: [{ label: 'Refrigerated (≤40°F)', value: 'cold' }, { label: 'Room Temp (>40°F)', value: 'warm' }] },
    { name: 'sellByDays', label: 'Sell-By Days from Production', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const milkFreshness: Record<string, { fridgeDays: number; unopenedBonus: number; smellCheck: string }> = { whole: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled' }, reduced: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled' }, skim: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled' }, lactose: { fridgeDays: 21, unopenedBonus: 7, smellCheck: 'May last longer, trust your nose' }, plant: { fridgeDays: 10, unopenedBonus: 3, smellCheck: 'Lumpy texture = spoiled' } }
    const mf = milkFreshness[v.milkType as keyof typeof milkFreshness] || milkFreshness.whole
    const maxFridgeDays = mf.fridgeDays + mf.unopenedBonus
    const daysRemaining = maxFridgeDays - v.purchaseDate
    const spoilageRisk = v.storageTemp === 'warm' ? 'HIGH — Milk left above 40°F spoils rapidly' : daysRemaining > 0 ? `${daysRemaining} day(s) remaining in fridge` : 'Past recommended window — check smell before consuming'
    return { result: daysRemaining, label: 'Days Left in Fridge', unit: 'days', steps: [{ label: 'Milk Type', value: `${v.milkType} (lasts ~${maxFridgeDays} days refrigerated)` }, { label: 'Days Since Purchase', value: `${v.purchaseDate} day(s)` }, { label: 'Estimated Shelf Life', value: `${maxFridgeDays} days` }, { label: 'Status', value: spoilageRisk }, { label: 'Freshness Check', value: mf.smellCheck }] }
  },
  description: 'Estimate milk freshness and expiration based on type, storage conditions, and time since purchase.',
  formula: 'DaysRemaining = (FridgeDays + UnopenedBonus) - DaysSincePurchase | Warm storage halves shelf life',
  interpretation: 'Refrigerated milk: 5-7 days past sell-by if stored ≤40°F. Plant milk: 7-10 days after opening. Always do a smell test — if it smells sour or has lumps, discard. Freeze milk for longer storage (3 months).'
}

export default calcDef
