import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth (in)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const volumeCF = v.length * v.width * (v.depth / 12)
    const volumeCY = volumeCF / 27
    const tons = volumeCY * 1.4
    return { result: tons, label: 'Gravel Needed', unit: 'tons', steps: [{ label: 'Volume', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Cubic Yards', value: `${volumeCY.toFixed(2)} cu yd` }, { label: 'Tons', value: `${tons.toFixed(2)} tons` }] }
  },
  description: 'Estimate gravel, crushed stone, or base material needed for driveways, paths, and landscaping. Calculate volume in cubic feet, cubic yards, and tons.',
  formula: 'Tons = (L × W × D/12) / 27 × 1.4 tons/cu yd',
  interpretation: 'Gravel weighs ~1.4 tons per cubic yard. Driveway depth: 4-6 in base + 2-3 in surface. Pea gravel: 2 in depth for walkways. Add 10% for compaction.'
}

export default calcDef
