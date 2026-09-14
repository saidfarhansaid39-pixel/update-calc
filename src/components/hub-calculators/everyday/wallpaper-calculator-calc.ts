import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wrWallLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrWallHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrRollWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrRollLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wrPatternRepeat: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wrWallLength', label: 'Wall Length (ft)', type: 'number', min: 1, step: '2' },
    { name: 'wrWallHeight', label: 'Wall Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'wrRollWidth', label: 'Roll Width (in)', type: 'number', min: 18, max: 54, step: '3' },
    { name: 'wrRollLength', label: 'Roll Length (ft)', type: 'number', min: 10, step: '5' },
    { name: 'wrPatternRepeat', label: 'Pattern Repeat (in)', type: 'number', min: 0, step: '2' },
  ],
  defaults: { wrWallLength: '12', wrWallHeight: '8', wrRollWidth: '20.5', wrRollLength: '33', wrPatternRepeat: '0' },
  presets: [
    { label: '10ft Wall, No Pattern', values: { wrWallLength: '10', wrWallHeight: '8', wrRollWidth: '20.5', wrRollLength: '33', wrPatternRepeat: '0' } },
    { label: 'Large Pattern Repeat (20in)', values: { wrWallLength: '14', wrWallHeight: '9', wrRollWidth: '20.5', wrRollLength: '33', wrPatternRepeat: '20' } },
    { label: 'European Roll (21in×33ft)', values: { wrWallLength: '12', wrWallHeight: '8', wrRollWidth: '21', wrRollLength: '33', wrPatternRepeat: '10' } },
  ],
  compute: (v) => {
    const wallPerimeter = v.wrWallLength
    const rollWidthFt = v.wrRollWidth / 12
    const stripsNeeded = Math.ceil(wallPerimeter / rollWidthFt)
    const usableHeight = v.wrWallHeight + (v.wrPatternRepeat / 12)
    const stripsPerRoll = Math.floor(v.wrRollLength / usableHeight)
    const rollsNeeded = Math.ceil(stripsNeeded / stripsPerRoll)
    const totalSqFt = wallPerimeter * v.wrWallHeight
    const wasteSqFt = rollsNeeded * v.wrRollWidth / 12 * v.wrRollLength - totalSqFt
    const wastePct = (wasteSqFt / (rollsNeeded * v.wrRollWidth / 12 * v.wrRollLength)) * 100
    return { result: rollsNeeded, label: 'Rolls of Wallpaper Needed', unit: 'rolls', steps: [{ label: 'Wall Length to Cover', value: `${wallPerimeter} ft` }, { label: 'Roll Width in Feet', value: `${v.wrRollWidth} in ÷ 12 = ${rollWidthFt.toFixed(2)} ft` }, { label: 'Strips Needed', value: `${wallPerimeter} ÷ ${rollWidthFt.toFixed(2)} = ${stripsNeeded} strips` }, { label: 'Usable Height per Strip', value: `${v.wrWallHeight} + ${v.wrPatternRepeat} in ÷ 12 = ${usableHeight.toFixed(2)} ft` }, { label: 'Strips per Roll', value: `floor(${v.wrRollLength} ÷ ${usableHeight.toFixed(2)}) = ${stripsPerRoll} strips` }, { label: 'Rolls Needed', value: `ceil(${stripsNeeded} ÷ ${stripsPerRoll}) = ${rollsNeeded} rolls` }, { label: 'Total Coverage Purchased', value: `${rollsNeeded} × ${v.wrRollWidth} in × ${v.wrRollLength} ft = ${(rollsNeeded * (v.wrRollWidth / 12) * v.wrRollLength).toFixed(0)} sq ft` }, { label: 'Waste', value: `${wasteSqFt.toFixed(1)} sq ft (${wastePct.toFixed(0)}%)` }] ,
    extras: [
      { label: 'Pattern Repeat Waste Impact', value: 'Pattern repeats dramatically affect waste. A 20-in repeat (common for florals and damasks) adds 1.67 ft per strip. For 9 ft ceilings: usable height = 10.67 ft, yielding only 3 strips per 33 ft roll (vs 4 strips for no-repeat). This increases total rolls by 25-33%.' },
      { label: 'Strip Cutting Strategy', value: 'Always order strips to account for pattern matching. For straight matches: align horizontally at same height. For drop matches: every other strip is offset by half the repeat. Drop matches waste ~10-15% more than straight matches due to alignment constraints.' },
      { label: 'Roll Measurement Standards', value: 'US single roll: 20.5 in × 16.5 ft (28 sq ft). US double roll: 20.5 in × 33 ft (56 sq ft) — most common. European: 21 in × 33 ft (57.8 sq ft). Metric: 53 cm × 10.05 m (5.3 m²). Always verify coverage area, not just roll count.' },
      { label: 'Ceiling & Trim Considerations', value: 'This calculator assumes full wall height coverage. For rooms with crown molding or chair rails, measure from the top of baseboard to bottom of crown molding. Add 2-3 in for trimming at top and bottom. Ceilings: wallpaper rolls cover ceilings separately using same method.' },
      { label: 'Buy Extra for Repairs', value: 'Always buy 1 extra roll beyond the calculated number for future repairs and matching. Store in a cool, dry place away from sunlight. Label the roll with the room name and dye lot. Damage from furniture moves, moisture, or kids can be patched seamlessly with the same dye lot.' },
      { label: 'Professional vs DIY', value: 'Professional installers charge $30-60/roll or $2-4/sq ft. Complex patterns, high ceilings, and difficult corners increase cost. DIY requires: sharp utility knife, smoothing tool, seam roller, plumb line, paste (if not pre-pasted). Expect first room to take 2-4 hours.' },
      { label: 'Wall Preparation Steps', value: '1. Remove old wallpaper (steam or score). 2. Patch holes and sand smooth. 3. Prime walls (sizing) — prevents adhesive soaking in, allows repositioning, ensures even adhesion. 4. Let primer dry 24 hours. 5. Mark plumb line for first strip alignment. Proper prep prevents 80% of installation problems.' },
    ]}
  },
  description: 'Calculate wallpaper rolls needed for a single wall or full room perimeter including wall dimensions, roll specifications, and pattern repeat. Accurate strip-counting method minimizes waste and extra purchases.',
  formula: 'RollsNeeded = ceil(StripsNeeded ÷ StripsPerRoll). StripsNeeded = ceil(WallLength ÷ (RollWidth_in ÷ 12)). StripsPerRoll = floor(RollLength_ft ÷ (WallHeight_ft + PatternRepeat_in ÷ 12)). WasteSqFt = RollsNeeded × RollWidth_ft × RollLength_ft - WallLength × WallHeight.',
  interpretation: 'A 12 ft wall with 8 ft ceiling, standard 20.5 in × 33 ft roll, and 0 in pattern repeat needs: strip width = 1.71 ft → 8 strips needed. Usable height = 8 ft → 4 strips per roll. Rolls needed = 8 ÷ 4 = 2 rolls (112 sq ft purchased for 96 sq ft wall = 14% waste). With a 20 in pattern repeat: usable height = 9.67 ft → 3 strips per roll. Rolls = 8 ÷ 3 = 3 rolls (168 sq ft purchased, 72 sq ft waste = 43% waste). Pattern repeats dramatically increase material costs — for large repeats, expect 30-50% waste vs 10-20% for no-repeat paper.'
}

export default calcDef
