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
  compute: (v) => {
    const perimeter = 2 * (v.wrcRoomWidth + v.wrcRoomLength)
    const wallArea = perimeter * v.wrcRoomHeight
    const netArea = wallArea - v.wrcDoorWindows
    const rollsBase = Math.ceil(netArea / v.wrcRollCoverage)
    const wasteFactor = 1.1
    const rollsTotal = Math.ceil(rollsBase * wasteFactor)
    const totalCost = 0
    return { result: rollsTotal, label: 'Wallpaper Rolls Required', unit: 'rolls', steps: [{ label: 'Wall Perimeter', value: perimeter + ' ft' }, { label: 'Gross Wall Area', value: wallArea.toFixed(1) + ' sq ft' }, { label: 'Minus Doors/Windows', value: '-' + v.wrcDoorWindows.toFixed(1) + ' sq ft' }, { label: 'Net Area', value: netArea.toFixed(1) + ' sq ft' }, { label: 'Base Rolls', value: '' + rollsBase }, { label: 'With Waste (10%)', value: '' + rollsTotal }] }
  },
  description: 'Calculate wallpaper rolls needed for a rectangular room accounting for doors, windows, and waste factor.',
  formula: 'Wall Area = 2 x (W+L) x H - Doors/Windows | Rolls = ceil(NetArea / RollCoverage) x 1.1',
  interpretation: 'Standard double roll covers ~56 sq ft (20.5 in x 33 ft). Account for doors (20 sq ft each) and windows (15 sq ft). Order all rolls from same dye lot for color consistency. Add 10% for waste and pattern matching.'
}

export default calcDef
