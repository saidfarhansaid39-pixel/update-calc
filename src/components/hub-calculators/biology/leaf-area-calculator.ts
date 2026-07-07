import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    width: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    k: z.string().optional().refine(v => !v || (parseFloat(v) > 0 && parseFloat(v) < 1), '0-1')
}),
  fields: [
    { name: 'length', label: 'Leaf Length', type: 'number', unit: 'cm', min: 0.1, step: '0.1' },
    { name: 'width', label: 'Leaf Width', type: 'number', unit: 'cm', min: 0.1, step: '0.1' },
    { name: 'k', label: 'Shape Factor', type: 'number', min: 0.1, max: 0.9, step: '0.01' },
  ],
  compute: (v) => {
    const k = v.k || 0.75
    const area = v.length * v.width * k
    return {
      result: area, label: 'Estimated Leaf Area', unit: 'cm²',
      steps: [
        { label: 'Leaf length', value: `${v.length} cm` },
        { label: 'Leaf width', value: `${v.width} cm` },
        { label: 'Shape factor (k)', value: `${k}` },
        { label: 'Estimated area', value: `${area.toFixed(2)} cm²` },
      ]
}
  },
  description: 'Leaf area is estimated from linear leaf measurements using a shape factor (k). It is used in plant physiology to assess growth, light interception, and transpiration.',
  formula: 'Leaf Area = Length × Width × k (k ~0.65–0.85 for most dicots)',
  interpretation: 'Shape factor k varies by leaf shape: 0.5 (triangular), 0.67 (elliptical), 0.75 (broadleaf), 0.85 (grass blades). Calibrate k for your species.'
}

export default calcDef
