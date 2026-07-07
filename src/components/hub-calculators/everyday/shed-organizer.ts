import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shedLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shedWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wallHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shelvingPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hangingPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'shedLength', label: 'Shed Length (ft)', type: 'number', min: 4, step: '1' },
    { name: 'shedWidth', label: 'Shed Width (ft)', type: 'number', min: 4, step: '1' },
    { name: 'wallHeight', label: 'Wall Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'shelvingPct', label: 'Wall % for Shelving', type: 'number', min: 0, max: 80, step: '10' },
    { name: 'hangingPct', label: 'Wall % for Hanging Tools', type: 'number', min: 0, max: 80, step: '10' },
  ],
  compute: (v) => {
    const floorArea = v.shedLength * v.shedWidth
    const wallPerimeter = 2 * (v.shedLength + v.shedWidth)
    const wallArea = wallPerimeter * v.wallHeight
    const shelfArea = wallArea * (v.shelvingPct / 100)
    const hangingArea = wallArea * (v.hangingPct / 100)
    const storageSqFt = floorArea * 2 + shelfArea * 0.5 + hangingArea * 0.3
    return { result: storageSqFt, label: 'Effective Storage Space', unit: 'sq ft', steps: [{ label: 'Floor Area', value: `${floorArea} sq ft` }, { label: 'Wall Area', value: `${wallArea} sq ft` }, { label: 'Shelving Space', value: `${shelfArea.toFixed(1)} sq ft` }, { label: 'Hanging Tool Wall', value: `${hangingArea.toFixed(1)} sq ft` }, { label: 'Effective Storage', value: `${storageSqFt.toFixed(0)} sq ft` }] }
  },
  description: 'Plan your shed organization by calculating effective storage space including floor area, shelving, and hanging wall storage for tools.',
  formula: 'Effective = Floor×2 + (Wall×Shelf%)×0.5 + (Wall×Hang%)×0.3',
  interpretation: 'Maximize vertical space with pegboards for tools and shelves for bins. Floor storage is most accessible — keep frequently used items there. Leave a walking path of at least 2 ft. Ceiling racks add 30-50% more storage.'
}

export default calcDef
