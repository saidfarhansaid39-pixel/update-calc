import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    width: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    depth: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'length', label: 'Length (longest axis)', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
    { name: 'width', label: 'Width', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
    { name: 'depth', label: 'Depth/Thickness', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const volEllipsoid = (4 / 3) * Math.PI * (v.length / 2) * (v.width / 2) * (v.depth / 2)
    const volCube = v.length * v.width * v.depth
    return {
      result: volEllipsoid, label: 'Estimated Volume (ellipsoid)', unit: 'mm³',
      steps: [
        { label: 'Length', value: `${v.length} mm` },
        { label: 'Width', value: `${v.width} mm` },
        { label: 'Depth', value: `${v.depth} mm` },
        { label: 'Ellipsoid V = 4/3 × p × L/2 × W/2 × D/2', value: `${volEllipsoid.toFixed(1)} mm³` },
        { label: 'Box estimate (L×W×D)', value: `${volCube.toFixed(1)} mm³` },
      ]
}
  },
  description: 'Biopsy volume estimation from three linear dimensions using the ellipsoid formula. Biopsy size determines tissue adequacy for histopathology, molecular analysis, and cell yield.',
  formula: 'V(ellipsoid) = 4/3 × p × L/2 × W/2 × D/2 | Core needle biopsy: 1-2 mm × 10-20 mm ? ~15-60 mm³ | Punch biopsy (4 mm): ~50 mm³',
  interpretation: 'Adequate biopsy: > 20 mm³ for most molecular tests. Core needle biopsies yield ~10-30 mg tissue. Smaller biopsies may have sampling error. Larger biopsies increase complication risk.'
}

export default calcDef
