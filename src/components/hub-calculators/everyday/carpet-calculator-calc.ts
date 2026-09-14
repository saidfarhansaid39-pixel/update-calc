import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), carpetPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'carpetPrice', label: 'Carpet Price ($/sq ft)', type: 'number', min: 0.5, step: '1' },
    { name: 'wastePct', label: 'Waste % (cutting/pattern)', type: 'number', min: 0, max: 30, step: '5' },
  ],
  defaults: { roomLength: '12', roomWidth: '14', carpetPrice: '4', wastePct: '10' },
  presets: [
    { label: 'Master Bedroom', values: { roomLength: '16', roomWidth: '14', carpetPrice: '5', wastePct: '10' } },
    { label: 'Living Room', values: { roomLength: '20', roomWidth: '18', carpetPrice: '6', wastePct: '15' } },
    { label: 'Small Bedroom', values: { roomLength: '10', roomWidth: '12', carpetPrice: '3', wastePct: '5' } },
    { label: 'Stairs & Hallway', values: { roomLength: '15', roomWidth: '8', carpetPrice: '4', wastePct: '20' } },
  ],
  compute: (v) => {
    const area = v.roomLength * v.roomWidth
    const wasteArea = area * (v.wastePct / 100)
    const totalArea = area + wasteArea
    const materialCost = totalArea * v.carpetPrice
    const standardRollWidth = 12
    const rollLengthNeeded = Math.ceil(v.roomLength / standardRollWidth) * standardRollWidth
    const rollArea = rollLengthNeeded * v.roomWidth
    return {
      result: totalArea, label: 'Carpet Needed', unit: 'sq ft',
      steps: [
        { label: 'Room Dimensions', value: `${v.roomLength} ft × ${v.roomWidth} ft` },
        { label: 'Base Room Area', value: `${area.toFixed(1)} sq ft (${v.roomLength} × ${v.roomWidth})` },
        { label: 'Waste Allowance', value: `+${wasteArea.toFixed(1)} sq ft (${v.wastePct}% for cuts/patterns)` },
        { label: 'Total Carpet to Order', value: `${totalArea.toFixed(1)} sq ft` },
        { label: 'Material Cost', value: `$${materialCost.toFixed(2)} (${totalArea.toFixed(1)} sq ft × $${v.carpetPrice})` },
        { label: 'Roll Width Consideration', value: `Standard 12 ft roll: ${rollLengthNeeded} ft length needed (uses ${rollArea} sq ft)` },
        { label: 'Square Yards', value: `${(totalArea / 9).toFixed(1)} sq yds (carpet often priced per sq yd)` },
        { label: 'Installation Estimate', value: `~$${(totalArea * 3).toFixed(0)}-$${(totalArea * 5).toFixed(0)} for professional install` },
      ],
      extras: [
        { label: 'Standard Carpet Roll Widths', value: 'Carpet is manufactured in 12 ft or 15 ft widths. Your room needs to fit within these widths to minimize seams. For a 12 ft × 14 ft room: 12 ft roll covers width, requiring ~14 ft length + waste.' },
        { label: 'Waste Factor Guide', value: '5% waste: Basic rectangular room, plain carpet, no patterns. 10%: Irregular shapes, closets, doorways. 15%: Patterned carpet requiring pattern matching (pattern repeat adds 1-2 ft per cut). 20%: Diagonal installation, stairs, or complex layouts.' },
        { label: 'Pattern Matching Premium', value: 'Patterned carpet requires extra material for matching. Pattern repeat length (e.g., 12 in, 36 in) determines extra waste. A 36-inch repeat adds ~1 yard of waste per seam. Order 1-2 extra yards for pattern alignment.' },
        { label: 'Installation Cost Breakdown', value: 'Professional installation: $2-5/sq ft. Includes: old carpet removal ($0.50-1/sq ft), padding ($0.50-1.50/sq ft), tack strips ($0.30-0.50/sq ft), stretching and seaming ($1-2/sq ft). DIY saves 30-50% but requires rented tools.' },
        { label: 'Carpet Quality Tiers', value: 'Economy ($2-4/sq ft): Polyester, 5-7yr lifespan. Mid-range ($4-8/sq ft): Nylon/olefin blend, 10-15yr. Premium ($8-15/sq ft): 100% nylon or wool, 15-25yr. Higher face weight (oz/sq yd) = better durability.' },
        { label: 'Padding Matters', value: 'Good padding extends carpet life by 50%. Recommended: 7/16 in rebond padding with 6-8 lb density for most rooms. Thicker (1/2 in) for bedrooms, thinner (3/8 in) for high-traffic areas. Padding cost: $0.50-1.50/sq ft.' },
        { label: 'Room Shape Adjustments', value: 'For L-shaped rooms, measure each rectangle separately. For closets, add width + 2 ft and length + 2 ft to the main room. Irregular shapes may add 10-15% more waste. Use laser measure for accuracy (±0.5 in).' },
        { label: 'Seam Placement Strategy', value: 'Seams should run parallel to the primary light source (windows) to be less visible. Avoid seams in doorways and high-traffic paths. Use seam tape and power stretcher for invisible seams. Maximum recommended seam-free width: 15 ft.' },
      ]
    }
  },
  description: 'Calculate the amount of carpet needed for a room including waste allowance for cutting, pattern matching, and roll width constraints. Get material quantities in sq ft and sq yds.',
  formula: 'Total = (L × W) × (1 + Waste%) | Cost = Total × Price/sq ft | sq yds = sq ft ÷ 9 | Install: $2-5/sq ft',
  interpretation: 'Standard carpet widths: 12 ft or 15 ft. Add 5% waste for basic rooms, 10-15% for patterns or irregular shapes, 20% for diagonal installation. Always order slightly more than calculated to account for measurement errors. Professional installation adds $2-5/sq ft to total cost.'
}

export default calcDef
