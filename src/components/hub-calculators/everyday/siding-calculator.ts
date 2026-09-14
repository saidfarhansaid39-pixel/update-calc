import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wallLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wallHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), openingsArea: z.string().optional(), costPerSqft: z.string().optional() }),
  fields: [
    { name: 'wallLength', label: 'Wall Length (ft)', type: 'number', min: 1, step: '5' },
    { name: 'wallHeight', label: 'Wall Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'openingsArea', label: 'Door/Window Area (sq ft)', type: 'number', min: 0, step: '20' },
    { name: 'costPerSqft', label: 'Cost per Sq Ft ($)', type: 'number', min: 0, step: '2' },
  ],
  compute: (v) => {
    const grossArea = v.wallLength * v.wallHeight
    const openings = parseFloat(v.openingsArea) || 0
    const netArea = grossArea - openings
    const wasteFactor = 1.1
    const sidingArea = Math.ceil(netArea * wasteFactor)
    const squares = Math.ceil(sidingArea / 100)
    const trimPieces = Math.ceil(v.wallLength / 10) * 2 + Math.ceil(v.wallHeight / 10) * 2
    const paintGallons = Math.ceil(sidingArea / 350)
    const cost = v.costPerSqft ? sidingArea * v.costPerSqft : null
    return { result: sidingArea, label: 'Siding Area Needed', unit: 'sq ft', steps: [{ label: 'Gross Wall Area', value: `${grossArea.toFixed(1)} sq ft` }, { label: 'Minus Openings', value: `-${openings.toFixed(1)} sq ft` }, { label: 'Net Area', value: `${netArea.toFixed(1)} sq ft` }, { label: 'With 10% Waste', value: `${sidingArea} sq ft` }, { label: 'Siding Squares', value: `${squares} squares (100 sq ft)` }, ...(cost !== null ? [{ label: 'Total Cost', value: `$${cost.toFixed(2)}` }] : [])], extras: [
      { label: 'Net Wall Area', value: `${netArea.toFixed(1)} sq ft` },
      { label: 'Siding Squares', value: `${squares}` },
      { label: 'Trim Pieces', value: `${trimPieces} pieces (10 ft)` },
      { label: 'Paint Needed', value: `${paintGallons} gal (covers ~350 sq ft)` },
      ...(cost !== null ? [{ label: 'Estimated Cost', value: `$${cost.toFixed(2)}` }] : []),
      { label: 'Waste Factor', value: '10% for cuts and waste' },
    ] }
  },
  description: 'Estimate siding material needed for exterior walls including trim pieces and paint.',
  formula: 'Siding = ((L × H) - Openings) × 1.1 | Squares = ceil(Siding / 100)',
  interpretation: '1 square = 100 sq ft of siding. Vinyl siding: $3-7/sq ft installed. Fiber cement: $5-10/sq ft. Wood: $6-12/sq ft. Order all from same batch for color consistency. Add J-channel, starter strips, and corner posts separately.'
}

export default calcDef
