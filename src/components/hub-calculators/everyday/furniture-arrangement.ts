import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLengthFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidthFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sofaLength: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tableLength: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), chairs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), clearanceFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'roomLengthFt', label: 'Room Length (ft)', type: 'number', min: 5, step: '1' },
    { name: 'roomWidthFt', label: 'Room Width (ft)', type: 'number', min: 5, step: '1' },
    { name: 'sofaLength', label: 'Sofa Length (ft)', type: 'number', min: 0, step: '1' },
    { name: 'tableLength', label: 'Coffee/Table Length (ft)', type: 'number', min: 0, step: '1' },
    { name: 'chairs', label: 'Number of Chairs', type: 'number', min: 0, step: '1' },
    { name: 'clearanceFt', label: 'Walkway Clearance (ft)', type: 'number', min: 1.5, step: '0.5' },
  ],
  compute: (v) => {
    const roomArea = v.roomLengthFt * v.roomWidthFt
    const sofaArea = v.sofaLength * 3
    const tableArea = v.tableLength * 2.5
    const chairsArea = v.chairs * 2.5
    const furnitureTotal = sofaArea + tableArea + chairsArea
    const walkwayArea = (v.roomLengthFt + v.roomWidthFt) * 2 * v.clearanceFt
    const usableArea = roomArea - walkwayArea
    const spaceUsedPct = (furnitureTotal / roomArea) * 100
    return { result: spaceUsedPct, label: 'Floor Space Used', unit: '%', steps: [{ label: 'Room Area', value: `${roomArea.toFixed(1)} sq ft` }, { label: 'Furniture Footprint', value: `${furnitureTotal.toFixed(1)} sq ft` }, { label: 'Walkway Space', value: `${walkwayArea.toFixed(1)} sq ft` }, { label: 'Space Used', value: `${spaceUsedPct.toFixed(0)}%` }] }
  },
  description: 'Plan your furniture arrangement by calculating floor space usage, walkway clearance, and furniture footprint in any room.',
  formula: 'Space Used % = Furniture Area / Room Area × 100 | Walkway = 2 × (L + W) × Clearance',
  interpretation: 'Keep 18-36 in walkways for comfortable movement. Sofa: 6-8 ft (3-seater). Coffee table: 3-4 ft from sofa. Allow 2 ft per dining chair when pulled out.'
}

export default calcDef
