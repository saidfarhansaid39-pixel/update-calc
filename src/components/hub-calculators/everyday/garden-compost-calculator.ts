import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenAreaSqFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), compostDepthIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gardenAreaSqFt', label: 'Garden Area (sq ft)', type: 'number', min: 1, step: '10' },
    { name: 'compostDepthIn', label: 'Compost Depth (inches)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { gardenAreaSqFt: '200', compostDepthIn: '2' },
  presets: [
    { label: 'Raised Bed (4×8 ft, 2 beds)', values: { gardenAreaSqFt: '64', compostDepthIn: '2' } },
    { label: 'Vegetable Garden Top-Dress', values: { gardenAreaSqFt: '300', compostDepthIn: '1' } },
    { label: 'New Flower Bed Preparation', values: { gardenAreaSqFt: '100', compostDepthIn: '3' } },
    { label: 'Large Garden Soil Amendment', values: { gardenAreaSqFt: '500', compostDepthIn: '2' } },
  ],
  compute: (v) => {
    const volumeCF = v.gardenAreaSqFt * (v.compostDepthIn / 12)
    const volumeCY = volumeCF / 27
    const bags40lb = Math.ceil(volumeCF * 7.5 / 50)
    const bags1CF = Math.ceil(volumeCF / 1)
    const bulkPrice = volumeCY * 35
    const bagPrice40lb = bags40lb * 5
    const bagPrice1CF = bags1CF * 4
    const savingsBulk = Math.max(0, bagPrice40lb - bulkPrice)
    const nutrientsN = (volumeCF * 0.5) * 0.01
    const waterRetentionGal = volumeCF * 0.3 * 7.48
    return { result: volumeCY, label: 'Compost Needed', unit: 'cu yd', steps: [{ label: 'Garden Area', value: `${v.gardenAreaSqFt} sq ft` }, { label: 'Desired Depth', value: `${v.compostDepthIn} in` }, { label: 'Volume (cubic feet)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Cubic Yards Needed', value: `${volumeCY.toFixed(2)} cu yd` }, { label: '40 lb Bags Needed', value: `${bags40lb} bags (1 bag ≈ 1.5 cu ft)` }, { label: '1 cu ft Bags Needed', value: `${bags1CF} bags` }, { label: 'Bulk Cost @ $35/cu yd', value: `$${bulkPrice.toFixed(2)}` }, { label: '40 lb Bag Cost @ $5 each', value: `$${bagPrice40lb.toFixed(2)}` }] ,
    extras: [
      { label: 'Bulk vs Bag Cost Savings', value: `Bulk: $${bulkPrice.toFixed(2)} ($${volumeCY.toFixed(2)} cu yd × $35/cu yd). Bags (40 lb): $${bagPrice40lb.toFixed(2)} (${bags40lb} bags × $5). Bulk saves $${savingsBulk.toFixed(2)} (${savingsBulk > 0 ? (savingsBulk / bagPrice40lb * 100).toFixed(0) + '%' : '0% — bags cheaper for small amounts'}). Break-even: ~${Math.ceil(50 / (bagPrice40lb / bags40lb - 35 / 27))} cu ft. Bulk is usually cheaper for ${volumeCF >= 15 ? 'your ' + volumeCF.toFixed(0) + ' cu ft need ✓' : 'small projects — bags are more practical'}. Delivery fee for bulk: $25-60 — add to comparison. Bulk compost is often higher quality (fresher, less processed) than bagged.` },
      { label: 'Application Depth Guidelines', value: `${v.compostDepthIn} in depth. Recommended: established garden top-dress: 1-2 in, new bed: 2-4 in (till in), lawn top-dress: 0.25-0.5 in, vegetable garden: 1-3 in. Your ${v.compostDepthIn} in is ${v.compostDepthIn < 0.5 ? 'too thin for most uses — increase to 1-2 in' : v.compostDepthIn < 1 ? 'adequate for established plants' : v.compostDepthIn < 2 ? 'good annual application for most gardens' : v.compostDepthIn < 3 ? 'heavy application — ideal for new beds or poor soil' : 'very deep — mix well, may need tilling'}. ${v.compostDepthIn > 3 ? 'Avoid exceeding 3 in without tilling — can create anaerobic conditions.' : ''} Apply in spring (before planting) or fall (after harvest) for best results. Avoid applying compost more than 3 in deep without incorporating into soil.` },
      { label: 'Compost Quality & Nutrient Value', value: `$${bagPrice40lb.toFixed(2)} for ${v.gardenAreaSqFt} sq ft. Compost value: adds ${nutrientsN.toFixed(2)} lb nitrogen, improves water retention by ${waterRetentionGal.toFixed(0)} gal, increases organic matter, feeds soil microbes, reduces need for synthetic fertilizer by 30-50%. A $5 bag of compost contains $2-4 of NPK value plus priceless soil structure benefits. Mushroom compost: higher pH, good for vegetables. Leaf compost: lower nutrient but excellent structure. Manure compost: higher nitrogen, must be aged. Worm castings: 5-10× nutrient density, $10-20/bag — use as inoculant, not bulk.` },
      { label: 'Seasonal Application Timing', value: `Apply ${volumeCY.toFixed(2)} cu yd in: spring (March-May) — best for pre-planting, nutrients release over growing season. Fall (Sept-Nov) — compost breaks down over winter, ready for spring planting, reduces weed seeds. Winter: not recommended (frozen ground, runoff). For ${v.gardenAreaSqFt} sq ft: spring application of ${v.compostDepthIn} in = $${bulkPrice.toFixed(2)}. Fall application same depth = same cost but better soil structure for next year. Many gardeners split: ½ spring ($${(bulkPrice / 2).toFixed(2)}), ½ fall ($${(bulkPrice / 2).toFixed(2)}). Avoid application before heavy rain — nutrient runoff wastes 15-30% of value.` },
      { label: 'Compost vs Synthetic Fertilizer', value: `$${bulkPrice.toFixed(2)} for ${volumeCY.toFixed(2)} cu yd compost vs synthetic fertilizer: $10-30 for NPK 10-10-10 covering ${v.gardenAreaSqFt} sq ft. Compost provides: slow-release nutrients (6-12 months), improved soil structure, water retention (${waterRetentionGal.toFixed(0)} gal capacity for your area), beneficial microbes, reduced erosion. Synthetic: fast results, precise NPK, cheaper up front, but can damage soil biology long-term. True value of compost: 5-10× the NPK price if you account for soil health. Best practice: compost as base (now $${bulkPrice.toFixed(2)}) + targeted synthetic for specific deficiencies.` },
      { label: 'Home Composting Savings', value: `$${bagPrice40lb.toFixed(2)} bought compost. Home composting: free from yard waste + kitchen scraps. A 3×3×3 ft bin produces ~1 cu yd/year ($35 value). Set-up: bin $50-200, or DIY $20-50. For ${v.gardenAreaSqFt} sq ft needing ${volumeCY.toFixed(2)} cu yd: home compost could supply ${Math.min(1, volumeCY).toFixed(0)} cu yd/year. Kitchen scraps: ~0.3 cu yd compost/year per person. Carbon:nitrogen ratio: 25-30:1 ideal.` },
      { label: 'Application Method Tips', value: `For ${v.gardenAreaSqFt} sq ft at ${v.compostDepthIn} in: top-dressing (spread on surface) — best for established beds. Tilling in (mix into top 4-6 in) — best for new beds or clay. Side-dressing (apply in bands) — efficient for vegetables. Compost tea (1 cup compost in 5 gal water) — liquid fertilizer. For your depth: ${v.compostDepthIn <= 2 ? 'top-dressing works well' : 'till in for best incorporation'}.` },
      { label: 'Environmental Impact Comparison', value: `Compost application to ${v.gardenAreaSqFt} sq ft sequesters ~${(volumeCF * 0.1).toFixed(1)} lb CO₂e/sq ft/year = ${(v.gardenAreaSqFt * 0.1).toFixed(0)} lb total. Reduces water needs by 20-30% = ${(waterRetentionGal / 7.48 * 12).toFixed(0)} gal saved/season. Every 1% increase in soil organic matter = 20,000 gal water-holding capacity per acre.` },
    ]}
  },
  description: 'Calculate how much compost you need for your garden based on area and desired application depth. Includes bulk vs bag comparison, nutrient value, seasonal timing, and home composting savings analysis.',
  formula: 'Compost (cu yd) = (Area × Depth/12) / 27 | 40lb Bags = ceil(Cu Ft × 7.5 / 50) | Bulk Cost = Cu Yd × $35 | Water Retention (gal) = Cu Ft × 0.3 × 7.48 | Bulk Savings = Bag Cost − Bulk Cost',
  interpretation: 'Apply 1-3 inches of compost annually for established gardens, 2-4 inches for new beds. A 40 lb bag covers ~10 sq ft at 1 in depth. Bulk compost costs $25-50/cu yd delivered vs $4-6 per 40 lb bag. For areas over 100 sq ft, bulk is significantly cheaper (save 40-60%). Compost improves soil structure, water retention (20-30% reduction in watering), adds slow-release nutrients, and feeds beneficial soil microbes. Best applied in spring before planting or fall after harvest. Never apply more than 3 inches without tilling into the soil. Good compost should smell earthy, not ammonia or rot.'
}

export default calcDef
