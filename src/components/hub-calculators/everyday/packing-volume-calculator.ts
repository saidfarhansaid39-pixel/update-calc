import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ largeItems: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), mediumItems: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), smallItems: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), suitcaseLiters: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'largeItems', label: 'Large Items (bulky sweaters, jackets)', type: 'number', min: 0, step: '1' },
    { name: 'mediumItems', label: 'Medium Items (shirts, pants)', type: 'number', min: 0, step: '1' },
    { name: 'smallItems', label: 'Small Items (underwear, socks)', type: 'number', min: 0, step: '5' },
    { name: 'suitcaseLiters', label: 'Suitcase Volume (liters)', type: 'number', min: 10, step: '10' },
  ],
  defaults: { largeItems: '3', mediumItems: '8', smallItems: '14', suitcaseLiters: '65' },
  presets: [
    { label: 'Weekend Away (carry-on)', values: { largeItems: '1', mediumItems: '4', smallItems: '6', suitcaseLiters: '40' } },
    { label: 'Week Trip (checked)', values: { largeItems: '3', mediumItems: '8', smallItems: '14', suitcaseLiters: '65' } },
    { label: 'Two Weeks Abroad', values: { largeItems: '5', mediumItems: '12', smallItems: '20', suitcaseLiters: '85' } },
    { label: 'Minimalist Packing', values: { largeItems: '1', mediumItems: '3', smallItems: '5', suitcaseLiters: '30' } },
  ],
  compute: (v) => { const itemVolumeL = v.largeItems * 3 + v.mediumItems * 1.5 + v.smallItems * 0.3; const totalItems = v.largeItems + v.mediumItems + v.smallItems; const fillPct = Math.min(100, (itemVolumeL / v.suitcaseLiters) * 100); const overflow = Math.max(0, itemVolumeL - v.suitcaseLiters); const spaceLeft = Math.max(0, v.suitcaseLiters - itemVolumeL); const withCompression = itemVolumeL * 0.8; const compressionFillPct = v.suitcaseLiters > 0 ? Math.min(100, (withCompression / v.suitcaseLiters) * 100) : 0; return { result: itemVolumeL, label: 'Total Item Volume', unit: 'L', steps: [
    { label: 'Large Items (3L each)', value: `${v.largeItems} × 3L = ${(v.largeItems * 3).toFixed(1)}L` },
    { label: 'Medium Items (1.5L each)', value: `${v.mediumItems} × 1.5L = ${(v.mediumItems * 1.5).toFixed(1)}L` },
    { label: 'Small Items (0.3L each)', value: `${v.smallItems} × 0.3L = ${(v.smallItems * 0.3).toFixed(1)}L` },
    { label: 'Total Volume', value: `${(v.largeItems * 3).toFixed(1)} + ${(v.mediumItems * 1.5).toFixed(1)} + ${(v.smallItems * 0.3).toFixed(1)} = ${itemVolumeL.toFixed(1)}L` },
    { label: 'Suitcase Capacity', value: `${v.suitcaseLiters}L` },
    { label: 'Fill Percentage', value: `${fillPct.toFixed(0)}% full` },
    { label: 'Space Left / Overfill', value: overflow > 0 ? `${overflow.toFixed(1)}L OVER (need bigger bag)` : `${spaceLeft.toFixed(1)}L remaining` },
    { label: 'With Compression Cubes', value: `~${withCompression.toFixed(1)}L (${compressionFillPct.toFixed(0)}% of bag)` },
  ] ,
    extras: [
      { label: 'Carry-On Limits', value: 'Most airlines: 40-45L max for carry-on (55×35×25 cm). Weight limits vary 7-10 kg (15-22 lbs).' },
      { label: 'Checked Baggage', value: 'Standard checked bags: 65-90L. Weight limit: 23 kg (50 lbs) for economy on most airlines.' },
      { label: 'Packing Cubes Savings', value: 'Compression cubes reduce volume by 20-25%, especially for puffy items like jackets and sweaters.' },
      { label: 'Rolling vs Folding', value: 'Rolling saves ~20% space for casual items. Fold dress shirts and formal wear to prevent wrinkles.' },
      { label: 'Shoe Volume Trick', value: 'Each pair of shoes takes 2-3L. Fill them with socks or small items to use dead space.' },
      { label: 'Item Count Check', value: `You have ${totalItems} items. Avg packing density: ~2 items per liter.` },
      { label: 'Airline Size Limits', value: 'Always check your airline\'s specific size limits — budget airlines are stricter on carry-on dimensions.' },
    ]} },
  description: 'Calculate whether your items will fit in your suitcase by estimating the total volume of clothing (large, medium, small) and comparing it to your luggage capacity. Includes compression savings estimates.',
  formula: 'TotalVolume = LargeItems×3L + MediumItems×1.5L + SmallItems×0.3L | Fill% = TotalVolume / SuitcaseCapacity × 100',
  interpretation: 'Carry-on: 40-45L max (check airline limits). Checked: 65-90L typical. A standard 7-day trip with 3 large, 8 medium, and 14 small items needs ~32L — fits easily in a carry-on. Packing cubes compress 20-25%. Rolling vs folding: rolling saves 20% more space for casual clothes. Fill shoes with small items to maximize space.'
}

export default calcDef
