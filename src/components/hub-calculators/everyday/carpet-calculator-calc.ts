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
    return { result: totalArea, label: 'Carpet Needed', unit: 'sq ft', steps: [{ label: 'Room Area', value: `${area.toFixed(1)} sq ft` }, { label: 'Waste Allowance', value: `${wasteArea.toFixed(1)} sq ft (${v.wastePct}%)` }, { label: 'Total to Order', value: `${totalArea.toFixed(1)} sq ft` }, { label: 'Material Cost', value: `$${materialCost.toFixed(2)}` }] }
  },
  description: 'Calculate the amount of carpet needed for a room including waste allowance for cutting and pattern matching. Enter room dimensions and carpet price.',
  formula: 'Total = (L × W) × (1 + Waste%) | Cost = Total × Price/sq ft',
  interpretation: 'Standard carpet widths: 12 ft or 15 ft. Add 5% waste for basic rooms, 10-15% for patterns or diagonal installation. Professional installation: $1-4/sq ft additional.'
}

export default calcDef
