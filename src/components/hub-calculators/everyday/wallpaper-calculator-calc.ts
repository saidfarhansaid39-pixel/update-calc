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
  compute: (v) => {
    const wallPerimeter = v.wrWallLength
    const rollWidthFt = v.wrRollWidth / 12
    const stripsNeeded = Math.ceil(wallPerimeter / rollWidthFt)
    const usableHeight = v.wrWallHeight + (v.wrPatternRepeat / 12)
    const stripsPerRoll = Math.floor(v.wrRollLength / usableHeight)
    const rollsNeeded = Math.ceil(stripsNeeded / stripsPerRoll)
    const totalSqFt = wallPerimeter * v.wrWallHeight
    const wasteSqFt = rollsNeeded * v.wrRollWidth / 12 * v.wrRollLength - totalSqFt
    return { result: rollsNeeded, label: 'Rolls of Wallpaper Needed', unit: 'rolls', steps: [{ label: 'Wall Perimeter', value: wallPerimeter + ' ft' }, { label: 'Strip Width', value: rollWidthFt.toFixed(2) + ' ft' }, { label: 'Strips Needed', value: '' + stripsNeeded }, { label: 'Strips per Roll', value: '' + stripsPerRoll }, { label: 'Rolls Needed', value: '' + rollsNeeded }, { label: 'Waste', value: wasteSqFt.toFixed(1) + ' sq ft' }] }
  },
  description: 'Calculate wallpaper rolls needed for a room including wall dimensions, roll size, and pattern repeat. Minimize waste.',
  formula: 'Rolls = ceil((Perimeter / RollWidth) / floor(RollLength / (Height + PatternRepeat)))',
  interpretation: 'Standard US roll: 20.5 in x 33 ft (single roll). European: 21 in x 33 ft. Pattern repeat: 0-24 in. Larger repeats = more waste. Buy 1 extra roll for future repairs. Paste-the-wall paper is easier to hang.'
}

export default calcDef
