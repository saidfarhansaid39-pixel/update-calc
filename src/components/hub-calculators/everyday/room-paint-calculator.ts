import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), coats: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), paintCostPerGal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'roomWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomHeight', label: 'Room Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'coats', label: 'Number of Coats', type: 'number', min: 1, max: 4, step: '1' },
    { name: 'paintCostPerGal', label: 'Paint Cost per Gallon ($)', type: 'number', min: 10, step: '10' },
  ],
  compute: (v) => {
    const wallArea = 2 * (v.roomWidth + v.roomLength) * v.roomHeight
    const ceilingArea = v.roomWidth * v.roomLength
    const totalArea = wallArea + ceilingArea
    const adjustedArea = totalArea * v.coats
    const gallons = Math.ceil(adjustedArea / 350)
    const paintCost = gallons * v.paintCostPerGal
    return { result: gallons, label: 'Paint Needed', unit: 'gal', steps: [{ label: 'Wall Area', value: `${wallArea.toFixed(0)} sq ft` }, { label: 'Ceiling Area', value: `${ceilingArea.toFixed(0)} sq ft` }, { label: 'Total (×${v.coats} coats)', value: `${adjustedArea.toFixed(0)} sq ft` }, { label: 'Gallons Needed', value: `${gallons} gal (covers 350 sq ft/gal)` }, { label: 'Paint Cost', value: `$${paintCost.toFixed(2)}` }] }
  },
  description: 'Calculate how much paint you need for a room including walls and ceiling, based on dimensions, coats, and paint coverage.',
  formula: 'Gallons = Ceil((2×(W+L)×H + W×L) × Coats / 350)',
  interpretation: 'One gallon covers ~350 sq ft. Add 10% for textured surfaces. Darker colors may need 3 coats. Primer: 1 coat before painting. Ceiling paint is typically separate. Buy all paint at once for color consistency.'
}

export default calcDef
