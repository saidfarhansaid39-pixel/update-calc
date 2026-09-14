import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), bedSize: z.string().min(1) }),
  fields: [
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomHeight', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'bedSize', label: 'Bed Size', type: 'select', options: [{ label: 'Twin', value: 'twin' }, { label: 'Full', value: 'full' }, { label: 'Queen', value: 'queen' }, { label: 'King', value: 'king' }, { label: 'Cal King', value: 'calKing' }] },
  ],
  defaults: { roomWidth: '12', roomHeight: '14', bedSize: 'queen' },
  presets: [
    { label: 'Queen Master Bedroom', values: { roomWidth: '14', roomHeight: '16', bedSize: 'queen' } },
    { label: 'King Master Bedroom', values: { roomWidth: '16', roomHeight: '18', bedSize: 'king' } },
    { label: 'Twin Guest Room', values: { roomWidth: '10', roomHeight: '12', bedSize: 'twin' } },
    { label: 'Full Kids Room', values: { roomWidth: '11', roomHeight: '13', bedSize: 'full' } },
  ],
  compute: (v) => {
    const bedDims: Record<string, { w: number; l: number }> = { twin: { w: 3.17, l: 6.25 }, full: { w: 4.25, l: 6.25 }, queen: { w: 5, l: 6.67 }, king: { w: 6.33, l: 6.67 }, calKing: { w: 6, l: 7 } }
    const bed = bedDims[v.bedSize] || bedDims.queen
    const rugW = bed.w + 3
    const rugL = bed.l + 2
    return { result: rugW * rugL, label: 'Recommended Rug Size', unit: 'sq ft', steps: [{ label: 'Bed Size', value: `${v.bedSize} (${bed.w}×${bed.l} ft)` }, { label: 'Rug Size', value: `${rugW.toFixed(0)}×${rugL.toFixed(0)} ft (${(rugW * rugL).toFixed(0)} sq ft)` }, { label: 'Clearance', value: `${(rugW - bed.w).toFixed(1)} ft on sides, ${(rugL - bed.l).toFixed(1)} ft at foot` }] ,
    extras: [
      { label: 'Bedroom Rug Placement', value: 'Option 1: Full rug under bed extends 18-24 in on sides and 18-24 in past foot. Option 2: Runners (24-30 in wide) on each side. Option 3: Rug at foot of bed only (5×7 or 6×9 ft)' },
      { label: 'Bed Size Quick Reference', value: 'Twin: 38×75 in (3.17×6.25 ft). Full: 54×75 in (4.5×6.25 ft). Queen: 60×80 in (5×6.67 ft). King: 76×80 in (6.33×6.67 ft). Cal King: 72×84 in (6×7 ft)' },
      { label: 'Nightstand Consideration', value: 'If using runners on each side, ensure runners extend from just past the nightstand to the foot of the bed. Standard nightstands: 20-28 in wide. Runners should be 24-30 in wide' },
      { label: 'Room Size Constraint', value: 'Recommended rug may not fit in smaller rooms. Minimum: rug should extend at least to the bottom third of the bed. Never use a rug smaller than the bed footprint — looks unbalanced' },
      { label: 'Layering in Bedrooms', value: 'Layer a smaller sheepskin or faux fur rug (2×3 or 3×4 ft) at the bedside for a soft landing spot over a larger area rug. Adds texture and luxury feel' },
      { label: 'Rug Pad Importance', value: 'Use a quality rug pad (1/4 to 3/8 in thick) under bedroom rugs. Prevents slipping, reduces wear, adds cushioning. Essential for hardwood or tile floors' },
      { label: 'Material Recommendations', value: 'Bedroom: wool or soft synthetic (soft underfoot). Low-pile for under bed (furniture rolls easier). Washable rugs (Ruggable-style) ideal for kids\' bedrooms and pet owners' },
    ]}
  },
  description: 'Find the perfect bedroom rug size based on bed type. Calculates rug dimensions that extend 18 in on each side and 24 in past the foot of the bed.',
  formula: 'RugWidth(ft) = BedWidth + 3 ft (18 in clearance each side). RugLength(ft) = BedLength + 2 ft (24 in clearance at foot). Optional: use runners (24-30 in wide) on each side instead.',
  interpretation: 'For a queen bed (60×80 in / 5×6.67 ft) in a 12×14 ft room, the recommended rectangular rug is 8×8.67 ft (~69 sq ft), extending 18 in on each side and 24 in past the foot. Standard closest size: 8×10 ft rug placed width-wise across the lower two-thirds of the bed. If the room can\'t accommodate a full rug, use 24-30 in wide runners on each side of the bed (4-6 ft long from nightstand to foot). A third option: a 5×7 or 6×9 ft rug placed horizontally at the foot of the bed. The top third of the bed may extend beyond the rug — this is acceptable and common in bedroom design.'
}

export default calcDef
