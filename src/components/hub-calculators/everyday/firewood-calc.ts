import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cords: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pricePerCord: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'cords', label: 'Cords of Firewood', type: 'number', min: 0.1, step: '0.5' },
    { name: 'pricePerCord', label: 'Price per Cord ($)', type: 'number', min: 1, step: '10' },
  ],
  defaults: { cords: '2', pricePerCord: '300' },
  presets: [
    { label: 'Seasoned Oak Winter Supply', values: { cords: '3', pricePerCord: '350' } },
    { label: 'Mixed Softwood Bundle', values: { cords: '1', pricePerCord: '200' } },
    { label: 'Full Cord Premium Hardwood', values: { cords: '1', pricePerCord: '450' } },
    { label: 'Season Supply (4 Cords)', values: { cords: '4', pricePerCord: '325' } },
  ],
  compute: (v) => { const c = parseFloat(v.cords)||0; const p = parseFloat(v.pricePerCord)||0; const total = c * p; const costPerCuFt = c > 0 ? total / (c * 128) : 0; const perSeason = total; const perMonth = total / 4; const perWeek = total / 16; const savingsBulk5 = total * 0.85; const savingsBulk10 = total * 0.75; return { result: total, label: 'Total Cost', unit: '$', steps: [{ label: 'Cords Purchased', value: `${c} cord(s) (${(c * 128).toFixed(0)} cu ft)` }, { label: 'Price per Cord', value: `$${p.toFixed(2)}` }, { label: 'Total Cost', value: `$${total.toFixed(2)}` }, { label: 'Cost per Cubic Foot', value: `$${costPerCuFt.toFixed(3)}` }, { label: 'Monthly Cost (4-mo season)', value: `$${perMonth.toFixed(2)}` }, { label: 'Weekly Cost (16 weeks)', value: `$${perWeek.toFixed(2)}` }, { label: 'Bulk Savings (5+ cords)', value: `$${savingsBulk5.toFixed(2)} (save $${(total - savingsBulk5).toFixed(2)})` }, { label: 'Bulk Savings (10+ cords)', value: `$${savingsBulk10.toFixed(2)} (save $${(total - savingsBulk10).toFixed(2)})` }] ,
    extras: [
      { label: 'Wood Type Comparison', value: `${c > 0 ? 'Hardwoods (oak/hickory): ' + p.toFixed(0) + '/cord - 24M BTU/cord, burns 6-8 hrs. Softwoods (pine/fir): $' + (p * 0.6).toFixed(0) + '/cord - 15M BTU/cord, burns 3-4 hrs. Your $' + p.toFixed(0) + '/cord suggests ' + (p > 300 ? 'premium hardwood' : p > 200 ? 'mixed wood' : 'softwood or green wood') + '. Seasoned wood (20% moisture) produces 40% more heat than green (50% moisture).' : 'Enter cord amount to see wood-type comparison.'}` },
      { label: 'Seasoning & Moisture Impact', value: `At your $${p.toFixed(0)}/cord: green wood needs 6-12 months seasoning. Kiln-dried costs 20-40% more but burns immediately and produces 30% less creosote. Burning unseasoned wood wastes ~30% of heat evaporating water. Split and stack off-ground, cover top, leave sides open for airflow.` },
      { label: 'Heating Value Comparison', value: `$${total.toFixed(0)} for ${c} cord(s) = ${(c * 24).toFixed(0)}M BTU (hardwood) or ${(c * 15).toFixed(0)}M BTU (softwood). Compare to: propane at $2.50/gal = $${(c * 24 * 1000000 / 91600 * 2.5).toFixed(0)}; heating oil at $3.50/gal = $${(c * 24 * 1000000 / 138000 * 3.5).toFixed(0)}; natural gas at $1.20/therm = $${(c * 24 * 1000000 / 100000 * 1.2).toFixed(0)}. Firewood saves ${(p < 300 ? '40-60%' : '10-30%')} vs fossil fuels.` },
      { label: 'Delivery & Stacking', value: `Add $50-100 for local delivery, $25-50 for stacking service. Full cord weighs 2-4 tons (3,000-4,000 lb for oak). Ensure truck access and dry storage for ${c > 2 ? 'multiple cords' : 'your cord(s)'}. Measure stack: 4 ft high × 8 ft long × 4 ft deep = 1 cord.` },
      { label: 'Burn Season Estimate', value: `$${total.toFixed(0)} for ${c} cord(s). A 2,000 sq ft home in moderate climate needs 3-5 cords/winter. Your ${c} cord(s) should last ${c >= 4 ? 'a full winter (4-5 months)' : c >= 2 ? 'about ' + (c * 1.2).toFixed(0) + ' months of regular use' : c + ' cord(s) = ' + (c * 4).toFixed(0) + ' weeks for occasional evening fires'}. Supplemental heat: 1-2 cords for zone heating.` },
      { label: 'BTU Efficiency per Dollar', value: `At $${p.toFixed(0)}/cord: hardwood delivers 24M BTU = ${(24 / p * 100).toFixed(0)} BTU/¢. Softwood delivers 15M BTU = ${(15 / p * 100).toFixed(0)} BTU/¢. Your best value is ${p < 250 ? 'softwood (cheaper per cord, less labor splitting)' : 'hardwood (burns longer, fewer refills, less ash)'}. Properly seasoned wood of any type outperforms green wood premium.` },
      { label: 'Environmental Impact', value: `Firewood is carbon-neutral when sustainably harvested. ${c} cord(s) = ~${(c * 1.5).toFixed(1)} tons CO₂ biogenic (vs ${(c * 24 * 1000000 / 91600 * 2.5 / 1000).toFixed(1)} tons for propane). EPA-certified stoves reduce particulate emissions by 70%. Never burn treated/painted wood — releases toxic chemicals. Source locally (<50 mi radius) to reduce transport emissions.` },
      { label: 'Seasonal Buying Tips', value: `Best prices: March-April (end of season clearance, save 15-25%). Worst: October-November (peak demand, +20%). Buying green wood in spring at $${(p * 0.85).toFixed(0)}/cord vs seasoned in fall at $${p.toFixed(0)} saves $${(c * p * 0.15).toFixed(0)} on ${c} cord(s). Split your own: save $50-100/cord. Join a co-op for bulk discounts.` },
    ]} },
  description: 'Calculate total cost of firewood based on cords purchased and price per cord. Includes heating value comparison, seasoning impact, bulk savings, and seasonal buying tips for smarter wood heating decisions.',
  formula: 'Total = Cords × Price per Cord | BTU Output = Cords × 24M BTU (hardwood) or 15M BTU (softwood) | Bulk Savings = Total × 0.85 (5+ cords) or × 0.75 (10+ cords) | Cost per Cu Ft = Total ÷ (Cords × 128)',
  interpretation: 'A full cord (4×4×8 ft, 128 cu ft) costs $200-$500+ depending on wood type, seasoning, and region. Hardwoods (oak, hickory, maple) offer 24M BTU/cord — 60% more heat than softwoods. Seasoned wood (<20% moisture) produces 40% more heat and 70% less creosote than green wood. A 2,000 sq ft home needs 3-5 cords per winter in moderate climates. Firewood is carbon-neutral when sustainably sourced and can save 40-60% vs heating oil or propane. Always buy by the cord (128 cu ft) — not "face cord" (42-48 cu ft) — and verify delivery volume by measuring the stacked pile.'
}

export default calcDef
