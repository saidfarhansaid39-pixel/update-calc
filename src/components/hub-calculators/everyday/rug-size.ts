import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), furnitureArrangement: z.string().min(1) }),
  fields: [
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'furnitureArrangement', label: 'Furniture Layout', type: 'select', options: [{ label: 'Under All Furniture', value: 'underAll' }, { label: 'Under Front Legs Only', value: 'frontLegs' }, { label: 'Floating (center only)', value: 'floating' }] },
  ],
  defaults: { roomLength: '15', roomWidth: '12', furnitureArrangement: 'frontLegs' },
  presets: [
    { label: 'Large Living Room', values: { roomLength: '20', roomWidth: '15', furnitureArrangement: 'frontLegs' } },
    { label: 'Medium Living Room', values: { roomLength: '15', roomWidth: '12', furnitureArrangement: 'frontLegs' } },
    { label: 'Cozy Den', values: { roomLength: '12', roomWidth: '10', furnitureArrangement: 'floating' } },
    { label: 'Formal Dining Room', values: { roomLength: '14', roomWidth: '12', furnitureArrangement: 'underAll' } },
  ],
  compute: (v) => {
    const roomSqft = v.roomLength * v.roomWidth
    const pcts: Record<string, number> = { underAll: 0.7, frontLegs: 0.5, floating: 0.35 }
    const pct = pcts[v.furnitureArrangement as keyof typeof pcts] || 0.5
    const idealArea = roomSqft * pct
    const side = Math.sqrt(idealArea)
    const recLength = v.roomLength * Math.sqrt(pct)
    const recWidth = v.roomWidth * Math.sqrt(pct)
    return { result: idealArea, label: 'Recommended Rug Area', unit: 'sq ft', steps: [{ label: 'Room Area', value: `${roomSqft.toFixed(0)} sq ft` }, { label: 'Coverage Target', value: `${(pct * 100).toFixed(0)}% of room` }, { label: 'Recommended Size', value: `${recLength.toFixed(0)}×${recWidth.toFixed(0)} ft (${idealArea.toFixed(0)} sq ft)` }] ,
    extras: [
      { label: 'Living Room Rule', value: 'Rug under front legs of sofa and chairs (50% coverage) visually anchors the seating area. All 4 legs on rug looks best but requires larger rug. Minimum: front legs only' },
      { label: 'Dining Room Guide', value: 'Rug should extend 24-36 in past table edge on all sides — allows chairs to stay on rug when pushed back. Dining tables: rug must accommodate pulled-out chairs' },
      { label: 'Bedroom Rug Rules', value: 'Runner on each side of bed: 24-30 in wide, from nightstand to foot of bed. Area rug at foot: extends 18-24 in on sides. Full rug under bed: add 18-24 in on sides and foot' },
      { label: 'Rug Size Standards', value: 'Common sizes: 4×6 (small area), 5×8 (entry/kitchen), 8×10 (medium room), 9×12 (large room), 10×14 (great room). Runner: 2.5×7 or 2.5×9 ft' },
      { label: 'Proportion Principle', value: 'Room should have 12-18 in of bare floor visible on all sides of rug for rooms ≤15 ft. For rooms >15 ft, 18-30 in border is appropriate. This frames the rug' },
      { label: 'Traffic Flow Consideration', value: 'In high-traffic areas, ensure rug doesn\'t obstruct door swings or walking paths. Allow 24-36 in wide clear paths around furniture and through doorways' },
      { label: 'Layering Rugs', value: 'Layer a smaller patterned rug (4×6 or 5×7) over a larger natural fiber rug (8×10) for texture. Popular in modern design. Use rug pad to prevent slipping' },
    ]}
  },
  description: 'Find the recommended rug size for any room based on dimensions and furniture layout. Three coverage modes: under all furniture, under front legs only, or floating in center.',
  formula: 'RugArea = RoomArea × CoverageTarget. Coverage: UnderAll = 70%, FrontLegs = 50%, Floating = 35%. RecLength = RoomLength × √(Coverage). RecWidth = RoomWidth × √(Coverage).',
  interpretation: 'For a 15×12 ft (180 sq ft) living room with front-legs arrangement (50%): recommended rug area is 90 sq ft, or approximately 10.6×8.5 ft — closest standard size is 8×10 or 9×12 ft. The rule of thumb: rug should be large enough that furniture front legs sit on it, with 12-18 in of bare floor visible around the perimeter. A rug that\'s too small makes the room feel disjointed; a rug that covers the entire floor looks like wall-to-wall carpeting. In dining rooms, ensure 24-36 in of rug extends past table edges so chairs remain on rug when occupied.'
}

export default calcDef
