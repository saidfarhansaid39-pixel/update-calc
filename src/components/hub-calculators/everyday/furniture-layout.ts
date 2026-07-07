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
  compute: (v) => {
    const area = v.layoutRoomLength * v.layoutRoomWidth
    const sofaSpace = v.layoutSofaCount * 18
    const chairSpace = v.layoutChairCount * 6
    const tableSpace = v.layoutTableCount * 10
    const totalFurnitureSpace = sofaSpace + chairSpace + tableSpace
    const openSpace = area - totalFurnitureSpace
    const pctFurnished = (totalFurnitureSpace / area) * 100
    return { result: pctFurnished, label: 'Furnished Space', unit: '%', steps: [{ label: 'Room Area', value: `${area} sq ft` }, { label: 'Furniture Coverage', value: `${totalFurnitureSpace.toFixed(0)} sq ft` }, { label: 'Open Floor Space', value: `${openSpace.toFixed(0)} sq ft` }, { label: 'Furnished', value: `${pctFurnished.toFixed(0)}%` }] }
  },
  description: 'Optimize your room layout by calculating furniture coverage and remaining open space. A well-balanced room has 30-50% furniture coverage.',
  formula: 'Furnished % = (Sofa×18 + Chair×6 + Table×10) / Room Area × 100',
  interpretation: 'Ideal furniture coverage: 30-50% of floor space. Over 60% feels cluttered. Under 20% feels empty. Balance large and small pieces for visual harmony.'
}

export default calcDef
