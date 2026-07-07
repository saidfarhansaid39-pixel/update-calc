import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomW: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomL: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomH: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), doors: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), windows: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), coats: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'roomW', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomL', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomH', label: 'Room Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'doors', label: 'Number of Doors', type: 'number', min: 0, step: '1' },
    { name: 'windows', label: 'Number of Windows', type: 'number', min: 0, step: '1' },
    { name: 'coats', label: 'Coats of Paint', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const wallArea = 2 * (v.roomW + v.roomL) * v.roomH; const doorArea = v.doors * 20; const windowArea = v.windows * 15; const netArea = wallArea - doorArea - windowArea; const ceilingArea = v.roomW * v.roomL; const totalArea = (netArea + ceilingArea) * v.coats; const gallons = totalArea / 400; const totalGallons = Math.ceil(gallons); return { result: totalGallons, label: 'Paint Needed', unit: 'gallons', steps: [{ label: 'Wall Area', value: `${wallArea.toFixed(0)} sq ft` }, { label: 'Minus Doors/Windows', value: `-${(doorArea + windowArea).toFixed(0)} sq ft` }, { label: 'Ceiling Area', value: `${ceilingArea.toFixed(0)} sq ft` }, { label: 'Total (×${v.coats} coats)', value: `${totalArea.toFixed(0)} sq ft` }, { label: 'Gallons (400 sq ft/gal)', value: `${totalGallons} gal` }] } },
  description: 'Calculate how much paint you need for a room based on dimensions, doors, windows, and number of coats.',
  formula: 'Gallons = Ceil([(2 × (W+L) × H − Doors×20 − Windows×15 + W×L) × Coats] / 400)',
  interpretation: 'One gallon covers ~400 sq ft. Primer counts as a coat. Dark colors need more coats. Textured walls need 20% more. Buy all paint at once to avoid color batch variation.'
}

export default calcDef
