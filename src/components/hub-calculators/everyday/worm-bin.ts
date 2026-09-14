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
  defaults: { wormPeople: '2', wormFoodWaste: '1.5', wormWasteUnit: 'lb', wormBinSize: 'medium' },
  presets: [
    { label: 'Single Person Apartment', values: { wormPeople: '1', wormFoodWaste: '0.5', wormWasteUnit: 'lb', wormBinSize: 'small' } },
    { label: 'Family of 4 Kitchen', values: { wormPeople: '4', wormFoodWaste: '3', wormWasteUnit: 'lb', wormBinSize: 'large' } },
    { label: 'Heavy Vegetable Gardener', values: { wormPeople: '2', wormFoodWaste: '2.5', wormWasteUnit: 'lb', wormBinSize: 'xl' } },
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
    return { result: weeklyLb, label: 'Weekly Food Waste', unit: 'lb', steps: [{ label: 'Daily Food Waste', value: `${dailyLb.toFixed(2)} lb` }, { label: 'Weekly Total', value: `${dailyLb.toFixed(2)} × 7 = ${weeklyLb.toFixed(1)} lb` }, { label: 'Monthly Total', value: `${dailyLb.toFixed(2)} × 30 = ${monthlyLb.toFixed(1)} lb` }, { label: 'Bin Capacity', value: `${cap.worms} worms, max ${cap.maxLbPerDay} lb/day (${cap.binSizeGal} gal bin)` }, { label: 'Capacity Assessment', value: isOverloaded ? `OVERLOADED — need ${dailyLb > cap.maxLbPerDay * 2 ? 'XL' : 'large'} bin` : 'Adequate — bin can handle this volume' }, { label: 'Est. Monthly Castings', value: `${monthlyLb.toFixed(1)} × 0.4 = ${castingsMonthlyLb.toFixed(1)} lb of vermicompost` }, { label: 'Weeks to Process', value: `~${compostingWeeks.toFixed(0)} weeks to compost monthly waste` }] ,
    extras: [
      { label: 'Worm Feeding Capacity', value: 'Red wigglers (Eisenia fetida) eat roughly half their body weight daily. 1,000 worms weigh ~1 lb and eat ~0.5 lb of food scraps per day. Never overfeed — excess food rots before worms can process it.' },
      { label: 'Bin Bedding Essentials', value: 'Fill bin 2/3 full with bedding (shredded newspaper, coconut coir, cardboard). Bedding retains moisture (70-80%) and provides carbon. Worms breathe through their skin — dry bedding suffocates them.' },
      { label: 'What to Feed Worms', value: 'Fruit/veg scraps, coffee grounds, crushed eggshells, bread, pasta. AVOID: meat, dairy, oily foods, citrus, onions, garlic — these cause odors and attract pests. Chop scraps small for faster processing.' },
      { label: 'Harvesting Castings', value: 'Worm castings (vermicompost) are a nutrient-rich soil amendment with 5x more nitrogen, 7x more potash, and 2x more calcium than ordinary soil. Harvest every 2-3 months. Use the "light migration" method to separate worms.' },
      { label: 'Troubleshooting Guide', value: 'Bad smell = too much food/not enough bedding. Worms escaping = wrong pH or moisture. Fruit flies = bury food under bedding. Mites = normal decomposers. Ants = bin too dry. Always keep bin in a cool, dark place (55-77°F).' },
      { label: 'Environmental Impact', value: 'Food waste in landfills produces methane (25× more potent than CO₂). Worm composting diverts waste, creates free fertilizer, and reduces your carbon footprint. One worm bin can divert 500+ lb of waste from landfill annually.' },
      { label: 'Scaling Up', value: 'As your worm population reproduces (they double every 60-90 days), you can upgrade bin size or start a second bin. Sell or share extra worms — 1,000 red wigglers sell for $30-50 online.' },
    ]}
  },
  description: 'Size your worm composting bin based on household food waste. Calculate worm count, bin capacity, weekly/monthly waste processing, and expected castings production for successful vermicomposting.',
  formula: 'DailyWaste(lb) = FoodWaste × ConversionFactor. WeeklyWaste = DailyWaste × 7. MonthlyWaste = DailyWaste × 30. CastingsMonthly = MonthlyWaste × 0.4 (40% conversion rate). CapacityCheck: DailyWaste ≤ BinMaxLbPerDay for adequate sizing.',
  interpretation: 'A family of 4 producing 1.5 lb/day of food scraps needs a medium bin (2,000 worms, 18 gal). This processes ~10.5 lb/week, ~45 lb/month, and produces ~18 lb of vermicompost monthly. The ideal bin size leaves room for bedding and allows worms to process food before it rots. If daily waste exceeds 1 lb for a medium bin, upgrade to a large bin (4,000 worms, 30 gal). Worm composting diverts 200-500+ lb/year from landfills while producing free, nutrient-dense soil amendment for gardens and houseplants.'
}

export default calcDef
