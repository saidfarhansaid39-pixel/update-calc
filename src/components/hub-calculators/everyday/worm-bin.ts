import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wormPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wormFoodWaste: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wormWasteUnit: z.string().min(1), wormBinSize: z.string().min(1) }),
  fields: [
    { name: 'wormPeople', label: 'Household Size', type: 'number', min: 1, step: '1' },
    { name: 'wormFoodWaste', label: 'Daily Food Waste', type: 'number', min: 0.1, step: '0.5' },
    { name: 'wormWasteUnit', label: 'Waste Unit', type: 'select', options: [{ label: 'Pounds (lb)', value: 'lb' }, { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Cups', value: 'cups' }] },
    { name: 'wormBinSize', label: 'Bin Size', type: 'select', options: [{ label: 'Small (10 gal) - 1,000 worms', value: 'small' }, { label: 'Medium (18 gal) - 2,000 worms', value: 'medium' }, { label: 'Large (30 gal) - 4,000 worms', value: 'large' }, { label: 'XL (50 gal) - 8,000 worms', value: 'xl' }] },
  ],
  compute: (v) => {
    const conversionFactors: Record<string, number> = { lb: 1, kg: 2.205, cups: 0.5 }
    const dailyLb = v.wormFoodWaste * (conversionFactors[v.wormWasteUnit] || 1)
    const weeklyLb = dailyLb * 7
    const monthlyLb = dailyLb * 30
    const wormCapacities: Record<string, any> = { small: { worms: 1000, maxLbPerDay: 0.5, binSizeGal: 10 }, medium: { worms: 2000, maxLbPerDay: 1, binSizeGal: 18 }, large: { worms: 4000, maxLbPerDay: 2, binSizeGal: 30 }, xl: { worms: 8000, maxLbPerDay: 4, binSizeGal: 50 } }
    const cap = wormCapacities[v.wormBinSize] || wormCapacities.medium
    const isOverloaded = dailyLb > cap.maxLbPerDay
    const compostingWeeks = monthlyLb / cap.maxLbPerDay
    const castingsMonthlyLb = monthlyLb * 0.4
    return { result: weeklyLb, label: 'Weekly Food Waste', unit: 'lb', steps: [{ label: 'Daily Waste', value: dailyLb.toFixed(2) + ' lb' }, { label: 'Weekly', value: weeklyLb.toFixed(1) + ' lb' }, { label: 'Monthly', value: monthlyLb.toFixed(1) + ' lb' }, { label: 'Worm Bin Capacity', value: cap.worms + ' worms, max ' + cap.maxLbPerDay + ' lb/day' }, { label: 'Assessment', value: isOverloaded ? 'Bin too small for this waste volume (upgrade to next size)' : 'Bin size is adequate' }, { label: 'Est. Monthly Castings', value: castingsMonthlyLb.toFixed(1) + ' lb of worm castings' }] }
  },
  description: 'Size your worm composting bin based on household food waste. Calculate worm count, bin capacity, and expected castings production.',
  formula: 'Worms needed: 1,000 per 0.5 lb daily waste | Castings output: ~40% of waste weight | 1 lb worms eats 0.5 lb food/day',
  interpretation: 'Red wiggler worms (Eisenia fetida) eat half their weight daily. 1,000 worms (~1 lb) need a 10 gal bin. Bins need bedding (shredded paper, coconut coir), moisture (70-80%), and darkness. Harvest castings every 2-3 months.'
}

export default calcDef
