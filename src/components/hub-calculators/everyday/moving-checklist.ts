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
  defaults: { rooms: '5', weeksUntilMove: '6', boxesPerRoom: '8', fragileItems: '15', furniturePieces: '10' },
  presets: [
    { label: 'Studio/1BR Apartment', values: { rooms: '3', weeksUntilMove: '4', boxesPerRoom: '6', fragileItems: '8', furniturePieces: '6' } },
    { label: '2BR House', values: { rooms: '5', weeksUntilMove: '6', boxesPerRoom: '8', fragileItems: '15', furniturePieces: '10' } },
    { label: '4BR Family Home', values: { rooms: '8', weeksUntilMove: '8', boxesPerRoom: '10', fragileItems: '30', furniturePieces: '18' } },
  ],
  compute: (v) => { const totalBoxes = v.rooms * v.boxesPerRoom; const boxesPerWeek = Math.ceil(totalBoxes / v.weeksUntilMove); const fragilePacks = Math.ceil(v.fragileItems / 3); const totalItems = totalBoxes + v.fragileItems + v.furniturePieces; const tapeRolls = Math.ceil(totalBoxes / 8); const markerCount = 2; const bubbleWrap = Math.ceil(v.fragileItems * 2); const boxCost = totalBoxes * 1.5; const tapeCost = tapeRolls * 4; const bwCost = bubbleWrap * 0.5; const totalSupplyCost = boxCost + tapeCost + bwCost + markerCount * 2; const weeksList = v.weeksUntilMove >= 4 ? [{ week: `Week ${v.weeksUntilMove - 3}`, task: 'Declutter & donate/sell unwanted items' }, { week: `Week ${v.weeksUntilMove - 2}`, task: `Pack ${boxesPerWeek} boxes — seasonal & rarely used items` }, { week: `Week ${v.weeksUntilMove - 1}`, task: `Pack ${boxesPerWeek} boxes — daily essentials, fragile items` }, { week: `Week ${v.weeksUntilMove}`, task: 'Last boxes, essentials bag, final clean' }] : [{ week: 'Now', task: 'Pack everything ASAP — consider professional packers' }]; return { result: totalBoxes, label: 'Total Boxes Needed', unit: 'boxes', steps: [
    { label: 'Rooms to Pack', value: `${v.rooms} rooms` },
    { label: 'Box Estimate', value: `${v.rooms} rooms × ${v.boxesPerRoom} boxes = ${totalBoxes} boxes` },
    { label: 'Packing Pace', value: `${totalBoxes} boxes / ${v.weeksUntilMove} weeks = ${boxesPerWeek} boxes/week` },
    { label: 'Fragile Items', value: `${v.fragileItems} items → ${fragilePacks} special packs` },
    { label: 'Furniture Pieces', value: `${v.furniturePieces} pieces` },
    { label: 'Supplies Needed', value: `${tapeRolls} tape rolls, ${markerCount} markers, ${bubbleWrap} sq ft bubble wrap` },
    { label: 'Estimated Supply Cost', value: `$${totalSupplyCost.toFixed(0)} (boxes $${boxCost.toFixed(0)} + tape $${tapeCost.toFixed(0)} + wrap $${bwCost.toFixed(0)})` },
  ] ,
    extras: [
      { label: 'Start Early', value: 'Begin packing 4-6 weeks before moving day. Pack one room at a time starting with rarely used items.' },
      { label: 'Essentials Bag', value: 'Pack a separate bag with 24-48 hrs of essentials: toiletries, meds, chargers, change of clothes, snacks.' },
      { label: 'Box Labeling', value: 'Label every box with room and contents. Use color-coded stickers per room for movers.' },
      { label: 'Box Sizes', value: 'Small boxes for heavy items (books). Large boxes for light items (linens). Keep each box under 50 lbs.' },
      { label: 'Packing Timeline', value: `${weeksList[0].week}: ${weeksList[0].task}` },
      { label: 'Fragile Wrapping', value: 'Wrap fragile items individually in 2 layers of bubble wrap. Use dish packs with dividers for glassware.' },
      { label: 'Moving Truck Size', value: totalBoxes <= 30 ? 'Small truck (10-12 ft) — studio/1BR' : totalBoxes <= 60 ? 'Medium truck (16-18 ft) — 2-3BR' : 'Large truck (24-26 ft) — 4+ BR house' },
      { label: 'Insurance Note', value: 'Check if your renter/homeowner\'s insurance covers moving damage. Consider mover valuation coverage.' },
    ]} },
  description: 'Plan your entire move with a complete packing checklist. Estimates boxes needed, supplies, weekly packing pace, supply costs, and provides a timeline based on your home size and moving deadline.',
  formula: 'Boxes = Rooms × BoxesPerRoom | Pace = Ceil(Boxes / Weeks) | Tape = Ceil(Boxes / 8) | BubbleWrap = Ceil(FragileItems × 2)',
  interpretation: 'Start packing 4-6 weeks before moving. A 2BR house with 5 rooms at 8 boxes/room needs 40 boxes at ~7 boxes/week for 6 weeks. Budget ~$80-150 for packing supplies (boxes, tape, wrap). Pack one room at a time, label everything by room and contents, and pack an essentials bag for your first 24-48 hours in the new home.'
}

export default calcDef
