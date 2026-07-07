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
  compute: (v) => { const itemVolumeL = v.largeItems * 3 + v.mediumItems * 1.5 + v.smallItems * 0.3; const totalItems = v.largeItems + v.mediumItems + v.smallItems; const fillPct = Math.min(100, (itemVolumeL / v.suitcaseLiters) * 100); const overflow = Math.max(0, itemVolumeL - v.suitcaseLiters); const spaceLeft = Math.max(0, v.suitcaseLiters - itemVolumeL); return { result: itemVolumeL, label: 'Total Item Volume', unit: 'L', steps: [{ label: 'Large Items', value: `${v.largeItems} × 3L = ${(v.largeItems * 3).toFixed(1)} L` }, { label: 'Medium Items', value: `${v.mediumItems} × 1.5L = ${(v.mediumItems * 1.5).toFixed(1)} L` }, { label: 'Small Items', value: `${v.smallItems} × 0.3L = ${(v.smallItems * 0.3).toFixed(1)} L` }, { label: 'Suitcase Capacity', value: `${v.suitcaseLiters} L (${fillPct.toFixed(0)}% full)` }, { label: 'Space Left', value: `${Math.max(0, spaceLeft).toFixed(1)} L` }] } },
  description: 'Calculate if your items will fit in your suitcase by estimating total volume of clothing and comparing to luggage capacity.',
  formula: 'Volume = Large×3L + Medium×1.5L + Small×0.3L | Fill% = Volume / Suitcase Capacity × 100',
  interpretation: 'Carry-on: 40-45L max. Checked: 65-90L typical. Packing cubes compress items 15-25%. Rolling vs folding: rolling saves 20% more space for casual clothes.'
}

export default calcDef
