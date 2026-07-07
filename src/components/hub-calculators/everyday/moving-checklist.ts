import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rooms: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), weeksUntilMove: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), boxesPerRoom: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fragileItems: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), furniturePieces: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'rooms', label: 'Rooms to Pack', type: 'number', min: 1, step: '1' },
    { name: 'weeksUntilMove', label: 'Weeks Until Move', type: 'number', min: 1, step: '1' },
    { name: 'boxesPerRoom', label: 'Boxes per Room', type: 'number', min: 0, step: '5' },
    { name: 'fragileItems', label: 'Fragile/Special Items', type: 'number', min: 0, step: '5' },
    { name: 'furniturePieces', label: 'Furniture Pieces', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => { const totalBoxes = v.rooms * v.boxesPerRoom; const boxesPerWeek = Math.ceil(totalBoxes / v.weeksUntilMove); const fragilePacks = Math.ceil(v.fragileItems / 3); const totalItems = totalBoxes + v.fragileItems + v.furniturePieces; const tapeRolls = Math.ceil(totalBoxes / 8); const markerCount = 2; const bubbleWrap = Math.ceil(v.fragileItems * 2); return { result: totalBoxes, label: 'Boxes Needed', unit: 'boxes', steps: [{ label: 'Total Boxes', value: `${totalBoxes}` }, { label: 'Boxes/Week Pace', value: `${boxesPerWeek}` }, { label: 'Fragile Packs', value: `${fragilePacks}` }, { label: 'Tape Rolls Needed', value: `${tapeRolls}` }, { label: 'Bubble Wrap (sq ft)', value: `${bubbleWrap}` }] } },
  description: 'Plan your move with a packing checklist that estimates boxes, supplies, and weekly packing pace based on home size.',
  formula: 'Boxes = Rooms × Boxes/Room | Pace = Boxes / Weeks | Supplies: 1 tape roll per 8 boxes, 2 markers, 2 sq ft bubble wrap per fragile item',
  interpretation: 'Start packing 4-6 weeks before moving. Pack one room at a time. Label boxes by room and contents. Essentials bag: items for first 24-48 hours in new home.'
}

export default calcDef
