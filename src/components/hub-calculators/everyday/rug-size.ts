import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), furnitureArrangement: z.string().min(1) }),
  fields: [
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'furnitureArrangement', label: 'Furniture Layout', type: 'select', options: [{ label: 'Under All Furniture', value: 'underAll' }, { label: 'Under Front Legs Only', value: 'frontLegs' }, { label: 'Floating (center only)', value: 'floating' }] },
  ],
  compute: (v) => {
    const roomSqft = v.roomLength * v.roomWidth
    const pcts: Record<string, number> = { underAll: 0.7, frontLegs: 0.5, floating: 0.35 }
    const pct = pcts[v.furnitureArrangement as keyof typeof pcts] || 0.5
    const idealArea = roomSqft * pct
    const side = Math.sqrt(idealArea)
    const recLength = v.roomLength * Math.sqrt(pct)
    const recWidth = v.roomWidth * Math.sqrt(pct)
    return { result: idealArea, label: 'Recommended Rug Area', unit: 'sq ft', steps: [{ label: 'Room Area', value: `${roomSqft.toFixed(0)} sq ft` }, { label: 'Coverage Target', value: `${(pct * 100).toFixed(0)}% of room` }, { label: 'Recommended Size', value: `${recLength.toFixed(0)}×${recWidth.toFixed(0)} ft (${idealArea.toFixed(0)} sq ft)` }] }
  },
  description: 'Find the ideal rug size for any room based on dimensions and furniture arrangement — front legs, under all, or floating.',
  formula: 'Rug Area = Room Area × Coverage% | Coverage: 70% (under all), 50% (front legs), 35% (floating)',
  interpretation: 'Living room: rug under front legs of furniture frames the seating area. Dining room: rug should extend 24-36 in past table edge. Bedroom: rug extends 18-24 in on sides and foot of bed.'
}

export default calcDef
