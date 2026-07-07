import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedSize: z.string().min(1) }),
  fields: [
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomHeight', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedSize', label: 'Bed Size', type: 'select', options: [{ label: 'Twin', value: 'twin' }, { label: 'Full', value: 'full' }, { label: 'Queen', value: 'queen' }, { label: 'King', value: 'king' }, { label: 'Cal King', value: 'calKing' }] },
  ],
  compute: (v) => {
    const bedDims: Record<string, { w: number; l: number }> = { twin: { w: 3.17, l: 6.25 }, full: { w: 4.25, l: 6.25 }, queen: { w: 5, l: 6.67 }, king: { w: 6.33, l: 6.67 }, calKing: { w: 6, l: 7 } }
    const bed = bedDims[v.bedSize] || bedDims.queen
    const rugW = bed.w + 3
    const rugL = bed.l + 2
    return { result: rugW * rugL, label: 'Recommended Rug Size', unit: 'sq ft', steps: [{ label: 'Bed Size', value: `${v.bedSize} (${bed.w}×${bed.l} ft)` }, { label: 'Rug Size', value: `${rugW.toFixed(0)}×${rugL.toFixed(0)} ft (${(rugW * rugL).toFixed(0)} sq ft)` }, { label: 'Clearance', value: `${(rugW - bed.w).toFixed(1)} ft on sides, ${(rugL - bed.l).toFixed(1)} ft at foot` }] }
  },
  description: 'Find the perfect bedroom rug size based on room dimensions and bed size. Ensures proper rug placement around the bed.',
  formula: 'Rug = (BedWidth + 3) × (BedLength + 2) | Extends 18 in on sides, 24 in at foot',
  interpretation: 'Bedroom rug should extend 18-24 in on each side and at the foot of the bed. A runner on each side is a good alternative. The rug should fit at least the bottom two-thirds of the bed.'
}

export default calcDef
