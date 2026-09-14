import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wrcRoomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrcRoomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrcRoomHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrcRollCoverage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrcDoorWindows: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wrcRoomWidth', label: 'Room Width (ft)', type: 'number', min: 5, step: '2' },
    { name: 'wrcRoomLength', label: 'Room Length (ft)', type: 'number', min: 5, step: '2' },
    { name: 'wrcRoomHeight', label: 'Room Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'wrcRollCoverage', label: 'Roll Coverage (sq ft)', type: 'number', min: 20, step: '10' },
    { name: 'wrcDoorWindows', label: 'Door/Window Area (sq ft)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { wrcRoomWidth: '12', wrcRoomLength: '14', wrcRoomHeight: '8', wrcRollCoverage: '56', wrcDoorWindows: '50' },
  presets: [
    { label: 'Small Bedroom (10×12×8)', values: { wrcRoomWidth: '10', wrcRoomLength: '12', wrcRoomHeight: '8', wrcRollCoverage: '56', wrcDoorWindows: '40' } },
    { label: 'Standard Living Room', values: { wrcRoomWidth: '14', wrcRoomLength: '18', wrcRoomHeight: '9', wrcRollCoverage: '56', wrcDoorWindows: '70' } },
    { label: 'Dining Room Accent Wall', values: { wrcRoomWidth: '12', wrcRoomLength: '12', wrcRoomHeight: '8', wrcRollCoverage: '56', wrcDoorWindows: '35' } },
  ],
  compute: (v) => {
    const perimeter = 2 * (v.wrcRoomWidth + v.wrcRoomLength)
    const wallArea = perimeter * v.wrcRoomHeight
    const netArea = wallArea - v.wrcDoorWindows
    const rollsBase = Math.ceil(netArea / v.wrcRollCoverage)
    const wasteFactor = 1.1
    const rollsTotal = Math.ceil(rollsBase * wasteFactor)
    const totalCost = 0
    return { result: rollsTotal, label: 'Wallpaper Rolls Required', unit: 'rolls', steps: [{ label: 'Room Perimeter', value: `2 × (${v.wrcRoomWidth} + ${v.wrcRoomLength}) = ${perimeter} ft` }, { label: 'Gross Wall Area', value: `${perimeter} × ${v.wrcRoomHeight} = ${wallArea.toFixed(1)} sq ft` }, { label: 'Subtract Doors/Windows', value: `${wallArea.toFixed(1)} - ${v.wrcDoorWindows.toFixed(1)} = ${netArea.toFixed(1)} sq ft` }, { label: 'Base Rolls (no waste)', value: `${netArea.toFixed(1)} ÷ ${v.wrcRollCoverage} = ${rollsBase} rolls` }, { label: 'Add 10% Waste Factor', value: `${rollsBase} × 1.1 = ${rollsTotal} rolls` }, { label: 'Total Coverage Purchased', value: `${rollsTotal} × ${v.wrcRollCoverage} sq ft = ${(rollsTotal * v.wrcRollCoverage).toFixed(0)} sq ft` }, { label: 'Expected Waste', value: `${(rollsTotal * v.wrcRollCoverage - netArea).toFixed(0)} sq ft (${((rollsTotal * v.wrcRollCoverage - netArea) / (rollsTotal * v.wrcRollCoverage) * 100).toFixed(0)}%)` }] ,
    extras: [
      { label: 'Standard Roll Sizes', value: 'US standard: 20.5 in wide × 33 ft long = ~56 sq ft per single roll (often sold as double rolls). European: 21 in × 33 ft. Some brands use metric sizes. Always check the actual coverage on the label before calculating.' },
      { label: 'Pattern Repeat Waste', value: 'Pattern matching increases waste significantly. Small repeat (0-5 in): 5-10% waste. Medium repeat (5-12 in): 10-20% waste. Large repeat (12-24 in): 20-35% waste. Drop matches waste more than straight matches. Buy 1-2 extra rolls for large pattern repeats.' },
      { label: 'Dye Lot Consistency', value: 'Always order all wallpaper from the same dye lot number. Dye lot variations cause noticeable color differences between rolls. Check before installing — if rolls don\'t match, return them immediately. Manufacturers cannot guarantee dye lot consistency across production runs.' },
      { label: 'Door & Window Deductions', value: 'Standard door: ~20 sq ft (3×7 ft). Standard window: ~15 sq ft (3×5 ft). French doors: ~40 sq ft. Sliding glass door: ~42 sq ft. Only subtract half the window area for conservative estimates (trim and casing waste).' },
      { label: 'Installation Tips', value: 'Prep walls: clean, patch holes, prime (especially new drywall). Use paste-the-wall paper for easier handling. Start at a corner and work around. Book the paper (let paste activate) for 5-10 min. Use a smoothing tool, not a brush. Trim with a sharp blade.' },
      { label: 'Cost Estimation', value: 'Wallpaper costs $25-100+ per roll. Professional installation: $30-60/roll. Total cost for a 12×14 ft room (7 rolls): materials $300-500 + labor $250-400 = $550-900. DIY saves installation cost but requires patience and precision.' },
      { label: 'Removal Considerations', value: 'Removable/repositionable wallpaper (temporary) costs more ($50-150/roll) but peels off without damaging walls. Traditional wallpaper requires steaming, scoring, or chemical removers. Factor removal cost ($1-3/sq ft) into total project budget.' },
    ]}
  },
  description: 'Calculate wallpaper rolls needed for a rectangular room accounting for doors, windows, and the standard 10% waste factor. Get detailed wall area breakdown and expected waste percentage.',
  formula: 'Perimeter = 2 × (Width + Length). GrossArea = Perimeter × Height. NetArea = GrossArea - DoorWindowArea. BaseRolls = ceil(NetArea ÷ RollCoverage). FinalRolls = ceil(BaseRolls × 1.1). Waste = (FinalRolls × Coverage - NetArea) ÷ (FinalRolls × Coverage) × 100.',
  interpretation: 'A 12×14 ft room with 8 ft ceilings (perimeter = 52 ft, gross wall area = 416 sq ft), minus 50 sq ft for doors and windows, yields 366 sq ft of net wall area. With 56 sq ft per roll (US standard double roll): 366 ÷ 56 = 6.5 → 7 base rolls. With 10% waste: 7 × 1.1 = 7.7 → 8 rolls total. You will purchase 448 sq ft of wallpaper for 366 sq ft of wall, with 82 sq ft (18%) waste. For large-pattern wallpaper with a 12-in repeat, waste can reach 25-30%, requiring 9-10 rolls for the same room.'
}

export default calcDef
