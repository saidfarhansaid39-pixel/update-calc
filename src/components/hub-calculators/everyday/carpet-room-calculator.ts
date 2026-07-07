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
  compute: (v) => {
    const area = v.roomLength * v.roomWidth
    const wasteArea = area * (v.wastePct / 100)
    const totalArea = area + wasteArea
    const materialCost = totalArea * v.carpetPrice
    return { result: materialCost, label: 'Total Carpet Cost', unit: '$', steps: [{ label: 'Room Area', value: `${area.toFixed(1)} sq ft` }, { label: 'Waste Added', value: `+${wasteArea.toFixed(1)} sq ft` }, { label: 'Total Needed', value: `${totalArea.toFixed(1)} sq ft` }, { label: 'Material Cost', value: `$${materialCost.toFixed(2)}` }] }
  },
  description: 'Calculate carpet cost for a room including waste factor. Enter room dimensions, carpet price per sq ft, and waste percentage for cutting and pattern matching.',
  formula: 'Total Cost = (L × W) × (1 + Waste%) × Price/sq ft',
  interpretation: 'Standard waste factor: 5-10% for plain carpet, 15-20% for patterned. Carpet is sold in 12 ft or 15 ft wide rolls. Professional installation adds $2-5/sq ft.'
}

export default calcDef
