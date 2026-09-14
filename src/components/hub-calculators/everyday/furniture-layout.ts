import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ layoutRoomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), layoutRoomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), layoutSofaCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), layoutChairCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), layoutTableCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'layoutRoomLength', label: 'Room Length (ft)', type: 'number', min: 5, step: '1' },
    { name: 'layoutRoomWidth', label: 'Room Width (ft)', type: 'number', min: 5, step: '1' },
    { name: 'layoutSofaCount', label: 'Number of Sofas', type: 'number', min: 0, step: '1' },
    { name: 'layoutChairCount', label: 'Number of Armchairs', type: 'number', min: 0, step: '1' },
    { name: 'layoutTableCount', label: 'Number of Tables', type: 'number', min: 0, step: '1' },
  ],
  defaults: { layoutRoomLength: '18', layoutRoomWidth: '14', layoutSofaCount: '1', layoutChairCount: '3', layoutTableCount: '2' },
  presets: [
    { label: 'Standard Living Room', values: { layoutRoomLength: '18', layoutRoomWidth: '14', layoutSofaCount: '1', layoutChairCount: '3', layoutTableCount: '2' } },
    { label: 'Compact Apartment', values: { layoutRoomLength: '12', layoutRoomWidth: '10', layoutSofaCount: '1', layoutChairCount: '1', layoutTableCount: '1' } },
    { label: 'Formal Sitting Room', values: { layoutRoomLength: '16', layoutRoomWidth: '14', layoutSofaCount: '2', layoutChairCount: '4', layoutTableCount: '3' } },
    { label: 'Open Plan Living', values: { layoutRoomLength: '24', layoutRoomWidth: '18', layoutSofaCount: '2', layoutChairCount: '4', layoutTableCount: '3' } },
  ],
  compute: (v) => {
    const area = v.layoutRoomLength * v.layoutRoomWidth
    const sofaSpace = v.layoutSofaCount * 18
    const chairSpace = v.layoutChairCount * 6
    const tableSpace = v.layoutTableCount * 10
    const totalFurnitureSpace = sofaSpace + chairSpace + tableSpace
    const openSpace = area - totalFurnitureSpace
    const pctFurnished = (totalFurnitureSpace / area) * 100
    const sofaSeats = v.layoutSofaCount * 3
    const totalSeats = sofaSeats + v.layoutChairCount
    const seatsPer100 = (totalSeats / area) * 100
    const openPerPerson = totalSeats > 0 ? openSpace / totalSeats : openSpace
    const idealFurnished = 35
    const adjustPct = pctFurnished - idealFurnished
    const suggestedSofas = adjustPct > 10 ? Math.max(0, v.layoutSofaCount - 1) : adjustPct < -10 ? v.layoutSofaCount + 1 : v.layoutSofaCount
    return { result: pctFurnished, label: 'Furnished Space', unit: '%', steps: [{ label: 'Room Dimensions', value: `${v.layoutRoomLength} × ${v.layoutRoomWidth} ft` }, { label: 'Room Area', value: `${area} sq ft` }, { label: 'Sofas × 18 sq ft', value: `${v.layoutSofaCount} × 18 = ${sofaSpace} sq ft` }, { label: 'Armchairs × 6 sq ft', value: `${v.layoutChairCount} × 6 = ${chairSpace} sq ft` }, { label: 'Tables × 10 sq ft', value: `${v.layoutTableCount} × 10 = ${tableSpace} sq ft` }, { label: 'Total Furniture Coverage', value: `${totalFurnitureSpace.toFixed(0)} sq ft` }, { label: 'Open Floor Space', value: `${openSpace.toFixed(0)} sq ft` }, { label: 'Furnished %', value: `${pctFurnished.toFixed(0)}%` }] ,
    extras: [
      { label: 'Furnished Percentage Guide', value: `${pctFurnished.toFixed(0)}% of floor covered by furniture. Ideal: 30-50%. ${pctFurnished < 20 ? 'Very sparsely furnished — consider adding ' + Math.ceil((area * 0.35 - totalFurnitureSpace) / 18) + ' more sofa(-equivalent) pieces to reach 35% coverage. Entryway furniture, area rugs, and potted plants fill space without clutter.' : pctFurnished < 30 ? 'Below ideal — add ' + Math.ceil((area * 0.35 - totalFurnitureSpace) / 6) + ' accent chairs or a sideboard to bring to 35%. Consider a larger area rug to anchor the space.' : pctFurnished <= 50 ? 'In the ideal range — well-balanced for comfort and flow ✓' : pctFurnished <= 60 ? 'Slightly full — consider removing ' + (Math.ceil((totalFurnitureSpace - area * 0.45) / 6)) + ' small items or replacing a sofa with 2 chairs for visual lightness' : 'Overfurnished by ' + (pctFurnished - 50).toFixed(0) + '% — remove ' + Math.max(1, Math.floor((totalFurnitureSpace - area * 0.45) / 10)) + ' piece(s). Rooms need visual breathing room.'}. Your coverage is ${pctFurnished <= 50 ? 'within' : 'above'} the 30-50% sweet spot.` },
      { label: 'Seating Capacity vs Room Size', value: `${totalSeats} total seats (${sofaSeats} from sofas + ${v.layoutChairCount} chairs) in ${area} sq ft = ${seatsPer100.toFixed(1)} seats per 100 sq ft. Standard: 2-3 seats per 100 sq ft for conversation, 1-2 for formal. Your ratio: ${seatsPer100 < 1 ? 'sparse seating — add ' + Math.ceil(area * 0.015 - totalSeats) + ' more seats' : seatsPer100 < 2 ? 'moderate seating — adequate for intimate gatherings' : seatsPer100 < 3.5 ? 'good conversation density — ideal for entertaining ✓' : 'dense seating — ' + (totalSeats) + ' seats may crowd the room for ' + area + ' sq ft'}. Each seat needs 15-25 sq ft of floor space (including clearance). Your open space per seat: ${openPerPerson.toFixed(0)} sq ft — ${openPerPerson >= 20 ? 'comfortable ✓' : openPerPerson >= 12 ? 'adequate' : 'tight — each seat feels cramped'}.` },
      { label: 'Sofa-to-Chair Balance', value: `${v.layoutSofaCount} sofa(s) (${sofaSeats} seats) + ${v.layoutChairCount} chairs. Your ${totalSeats} seats: ${sofaSeats / totalSeats * 100 > 50 ? 'sofa-dominant — good for cozy lounging' : 'chair-dominant — flexible for conversation groups'}.` },
      { label: 'Table Placement & Surface Need', value: `${v.layoutTableCount} table(s) × 10 sq ft = ${tableSpace} sq ft. For ${area} sq ft room: recommended 2-4 surfaces. You have ${v.layoutTableCount} — ${v.layoutTableCount >= 2 ? 'adequate surface area ✓' : 'may need 1-2 more tables'}. For ${totalSeats} seats: provide at least ${Math.ceil(totalSeats / 2)} table surfaces for drink placement.` },
      { label: 'Traffic Flow & Circulation', value: `Open space: ${openSpace.toFixed(0)} sq ft (${((openSpace / area) * 100).toFixed(0)}% of room). Standard: 40-60% open space. Your open space = ${(openSpace / area * 100).toFixed(0)}% — ${openSpace / area >= 0.5 ? 'excellent flow ✓' : openSpace / area >= 0.35 ? 'adequate' : 'cramped — reduce furniture'}. Key walkway widths: main paths min 36 in, secondary 24 in.` },
      { label: 'Room Function & Furniture Mix', value: `With ${totalSeats} seats and ${v.layoutTableCount} tables in ${area} sq ft: primary function is ${totalSeats >= 6 ? 'entertaining (6+ seats)' : totalSeats >= 3 ? 'conversation/TV lounge (3-5 seats)' : 'reading/relaxation (1-2 seats)'}.` },
      { label: 'Visual Weight Distribution', value: `${v.layoutSofaCount} sofa(s) = dominant visual weight. ${v.layoutChairCount} chairs = medium weight. ${v.layoutTableCount} tables = light-to-medium weight. Arrange heaviest pieces first (sofas), then balance with chairs. Rule: distribute weight evenly across room.` },
      { label: 'Room Zoning Recommendations', value: `For ${v.layoutRoomLength}×${v.layoutRoomWidth} ft = ${area} sq ft: zone 1 — conversation (sofas + chairs = ${sofaSpace + chairSpace} sq ft), zone 2 — surfaces (tables = ${tableSpace} sq ft). ${area >= 250 ? 'Floating or matrix layout works well' : 'Perimeter layout maximizes open space'}.` },
    ]}
  },
  description: 'Optimize your room layout by calculating furniture coverage and remaining open space. A well-balanced room has 30-50% furniture coverage. Includes seating density, traffic flow, and visual weight distribution analysis.',
  formula: 'Furnished % = (Sofas × 18 + Chairs × 6 + Tables × 10) / Room Area × 100 | Seats = Sofas × 3 + Chairs | Open Space = Area − Furniture | Seats per 100 sq ft = Seats ÷ Area × 100',
  interpretation: 'Ideal furniture coverage: 30-50% of floor space. Over 60% feels cluttered — under 20% feels empty. Standard sofa footprint: 7 ft × 2.5 ft = 18 sq ft. Armchair: 2.5 × 2.5 = 6 sq ft. Coffee table: 4 × 2.5 = 10 sq ft. A 252 sq ft room (18×14) with 1 sofa + 3 chairs + 2 tables = 46 sq ft furniture = 18% coverage (underfurnished). Add an area rug and one more piece for balance. Balance large and small pieces for visual harmony: sofas anchor the room, chairs provide flexibility, and tables offer surface area. Always plan traffic flow before buying — measure everything including walkway clearance.'
}

export default calcDef
