import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pricePerSqFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'pricePerSqFt', label: 'Price per Sq Ft ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'wastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '1' },
  ],
  compute: (v) => { const l = parseFloat(v.roomLength)||0; const w = parseFloat(v.roomWidth)||0; const p = parseFloat(v.pricePerSqFt)||0; const wp = parseFloat(v.wastePct)||0; const area = l * w; const waste = area * (wp / 100); const total = (area + waste) * p; return { result: total, label: 'Total Cost', unit: '$', steps: [{ label: 'Room Area', value: `${area.toFixed(1)} sq ft` }, { label: 'Waste', value: `${waste.toFixed(1)} sq ft` }, { label: 'Total Cost', value: `$${total.toFixed(2)}` }] } },
  description: 'Calculate flooring material costs including waste factor for cutting and mistakes. Enter room dimensions and material price.',
  formula: 'Total Cost = (Length × Width × (1 + Waste%)) × Price/sq ft',
  interpretation: 'Standard waste factor: 5-10% for straight layouts, 10-15% for diagonal or patterned installs. Always buy extra for future repairs.'
}

export default calcDef
