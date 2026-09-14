import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'bedLength', label: 'Bed Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedWidth', label: 'Bed Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedDepth', label: 'Soil Depth (in)', type: 'number', min: 6, step: '3' },
  ],
  defaults: { bedLength: '8', bedWidth: '4', bedDepth: '12' },
  presets: [
    { label: 'Standard 4×8 Raised Bed (12 in)', values: { bedLength: '8', bedWidth: '4', bedDepth: '12' } },
    { label: 'Deep 4×8 Raised Bed (18 in)', values: { bedLength: '8', bedWidth: '4', bedDepth: '18' } },
    { label: 'Large 4×12 Garden Plot (18 in)', values: { bedLength: '12', bedWidth: '4', bedDepth: '18' } },
    { label: 'Small 2×4 Herb Box (10 in)', values: { bedLength: '4', bedWidth: '2', bedDepth: '10' } },
  ],
  compute: (v) => {
    const volumeCF = v.bedLength * v.bedWidth * (v.bedDepth / 12)
    const volumeCY = volumeCF / 27
    const bags = Math.ceil(volumeCF / 1.5)
    const bulkCost = volumeCY * 50
    const bagCost = bags * 6
    const savings = Math.max(0, bagCost - bulkCost)
    const topsoilNeeded = volumeCY * 0.4
    const compostNeeded = volumeCY * 0.4
    const aerationNeeded = volumeCY * 0.2
    const topsoilCost = topsoilNeeded * 30
    const compostCostBulk = compostNeeded * 35
    const aerationCost = aerationNeeded * 40
    const customMixTotal = topsoilCost + compostCostBulk + aerationCost
    const sqftArea = v.bedLength * v.bedWidth
    return { result: volumeCY, label: 'Total Soil Needed', unit: 'cu yd', steps: [{ label: 'Bed Dimensions', value: `${v.bedLength} × ${v.bedWidth} × ${v.bedDepth} in` }, { label: 'Bed Area', value: `${sqftArea} sq ft` }, { label: 'Volume (cubic feet)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Cubic Yards Needed', value: `${volumeCY.toFixed(2)} cu yd` }, { label: '1.5 cu ft Bags Needed', value: `${bags} bags` }, { label: 'Estimated Soil Weight', value: `${(volumeCF * 75).toFixed(0)} lb (soil: ~75 lb/cu ft)` }, { label: 'Bulk Cost (delivered)', value: `$${bulkCost.toFixed(2)}` }, { label: 'Bag Cost (@ $6/bag)', value: `$${bagCost.toFixed(2)}` }] ,
    extras: [
      { label: 'Custom Mix Recipe: 40-40-20', value: `For ${volumeCY.toFixed(2)} cu yd total: topsoil ${topsoilNeeded.toFixed(2)} cu yd ($${topsoilCost.toFixed(2)} @ $30/cu yd), compost ${compostNeeded.toFixed(2)} cu yd ($${compostCostBulk.toFixed(2)} @ $35/cu yd), aeration (perlite/pumice) ${aerationNeeded.toFixed(2)} cu yd ($${aerationCost.toFixed(2)} @ $40/cu yd). Total mix cost: $${customMixTotal.toFixed(2)} vs $${bulkCost.toFixed(2)} pre-mixed. DIY mix saves $${Math.max(0, bulkCost - customMixTotal).toFixed(2)} and lets you control quality. For ${v.bedDepth} in deep beds: deeper beds (>12 in) need more aeration for drainage. Add worm castings ($${(volumeCY * 2 * 15).toFixed(0)}) or slow-release fertilizer for extra nutrition.` },
      { label: 'Bulk vs Bagged Soil Economics', value: `${volumeCY.toFixed(2)} cu yd needed. Bulk: $${bulkCost.toFixed(2)} (delivered). Bags: $${bagCost.toFixed(2)} (${bags} bags × $6). Bulk saves $${savings.toFixed(2)} (${Math.round(savings / bagCost * 100)}%). ${volumeCF >= 20 ? 'Bulk recommended ✓' : 'Bags more practical for small beds'}. Delivery fee: $25-60.` },
      { label: 'Depth Guidelines by Plant Type', value: `${v.bedDepth} in depth. Shallow-rooted (lettuce, herbs): 6-8 in. Medium-rooted (tomatoes, peppers): 12-15 in. Deep-rooted (carrots, potatoes): 18-24 in. Your ${v.bedDepth} in bed is ${v.bedDepth < 8 ? 'best for greens/herbs only' : v.bedDepth < 12 ? 'adequate for most vegetables' : v.bedDepth < 18 ? 'great for deep-rooted vegetables' : 'excellent depth for maximum root development'}. Most vegetables need 8-12 in of quality soil.` },
      { label: 'Soil Weight & Bed Structure', value: `Soil weight: ~${(volumeCF * 75).toFixed(0)} lb dry (${(volumeCF * 100).toFixed(0)} lb wet). Your ${v.bedLength}×${v.bedWidth} ft bed: ${v.bedLength >= 6 ? 'long beds need center support — add cross-brace every 4 ft' : 'short bed — no support needed'}. ${v.bedDepth >= 12 ? 'Deep bed: use 2×6 or 2×8 lumber' : '2×6 lumber is adequate'}.` },
      { label: 'Seasonal Soil Refreshing', value: `Initial fill: ${volumeCY.toFixed(2)} cu yd. Annual top-dress with 1-2 in compost = $${((sqftArea * 1.5 / 12 / 27) * 35).toFixed(0)}/year. Every 3-5 years: replace 25% of soil. 5-year cost: $${(bulkCost + (sqftArea * 1.5 / 12 / 27) * 35 * 4 + volumeCY * 0.25 * 50).toFixed(0)}. Soil is a multi-year investment for healthier plants.` },
      { label: 'Drainage & Water Retention', value: `Soil depth ${v.bedDepth} in: good drainage requires ${aerationNeeded.toFixed(1)} cu yd perlite/pumice. Water needs: ~${(sqftArea * (v.bedDepth / 12) * 7.48 * 0.25).toFixed(0)} gal/watering. Drip irrigation saves 30-50%. Rain: 1 in on ${sqftArea} sq ft = ${(sqftArea / 12 * 7.48).toFixed(0)} gal.` },
      { label: 'Raised Bed Cost Projection', value: `Materials: bed frame $50-100. Soil: $${bulkCost.toFixed(2)} bulk or $${bagCost.toFixed(2)} bagged. Hardware cloth: $${(sqftArea * 0.5).toFixed(0)}-${(sqftArea * 1).toFixed(0)}. Irrigation: $30-60. Total first-year: $${(75 + bulkCost + sqftArea * 0.75 + 45 + 50).toFixed(0)}-${(100 + bagCost + sqftArea * 1 + 60 + 100).toFixed(0)}. A 4×8 bed grows $200-600/year in produce.` },
      { label: 'Soil Testing & Amendment', value: `Test native soil pH ($15-30 kit). Ideal pH: 6.0-7.0. Your mix: 40% topsoil + 40% compost + 20% aeration. Adjust with lime (raise pH), sulfur (lower pH). Add 1-2 in finished compost on top. Worm castings: 1 cup per sq ft. Mycorrhizal fungi: improves nutrient uptake 30-50%.` },
    ]}
  },
  description: 'Calculate garden soil volume needed for raised beds and garden plots. Get cubic yards, bag estimates, and custom soil mix proportions (40-40-20: topsoil, compost, aeration) with cost comparisons.',
  formula: 'Soil (cu yd) = (L × W × D/12) / 27 | Bags = Ceil(Cu Ft ÷ 1.5) | Weight = Cu Ft × 75 lb | Custom Mix: Topsoil 40% = Cu Yd × 0.4, Compost 40% = Cu Yd × 0.4, Aeration 20% = Cu Yd × 0.2',
  interpretation: 'Standard raised bed depth: 12 in for shallow roots (lettuce, herbs), 18 in for deep roots (tomatoes, carrots). One cubic yard fills ~100 sq ft at 3 in depth or one 4×8 ft bed at 10 in depth. The ideal soil mix for raised beds: 40% topsoil (structure/minerals), 40% compost (nutrients/microbes), 20% aeration (perlite/pumice for drainage). Bulk soil costs $30-60/cu yd delivered vs $5-8 per 1.5 cu ft bag — bulk is 40-60% cheaper for beds over 20 cu ft. Deep beds (18+ in) can use hügelkultur (logs/sticks at bottom) to reduce soil volume by 30-50%. Always test and amend soil before planting for best results.'
}

export default calcDef
