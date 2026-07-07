import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    measured: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    magnification: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'measured', label: 'Measured Size (on image)', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
    { name: 'magnification', label: 'Magnification', type: 'number', min: 10, step: '10' },
  ],
  compute: (v) => {
    const actualMm = v.measured / v.magnification
    const actualUm = actualMm * 1000
    return {
      result: actualUm, label: 'Actual Cell Size', unit: 'µm',
      steps: [
        { label: 'Measured size', value: `${v.measured} mm` },
        { label: 'Magnification', value: `${v.magnification}x` },
        { label: 'Actual size', value: `${actualMm.toFixed(4)} mm` },
        { label: 'Actual size', value: `${actualUm.toFixed(1)} µm` },
      ]
}
  },
  description: 'Actual cell size is calculated by dividing the measured size on a micrograph by the magnification. This helps identify cell types and understand cellular scale.',
  formula: 'Actual Size (µm) = Measured Size (mm) × 1000 / Magnification',
  interpretation: 'Typical cell sizes: RBC ~7 µm, WBC ~12 µm, epithelial ~30 µm, plant cells ~50-100 µm. Bacteria: 1-5 µm. Viruses: 0.02-0.3 µm.'
}

export default calcDef
