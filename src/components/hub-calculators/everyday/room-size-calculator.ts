import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Rectangle', value: 'rect' }, { label: 'Square', value: 'square' }, { label: 'L-Shaped', value: 'lshape' }] },
  ],
  compute: (v) => {
    let sqft = 0
    if (v.shape === 'rect' || v.shape === 'square') sqft = v.length * v.width
    else sqft = v.length * v.width * 0.85
    const perimeter = 2 * (v.length + v.width)
    return { result: sqft, label: 'Room Area', unit: 'sq ft', steps: [{ label: 'Dimensions', value: `${v.length} × ${v.width} ft` }, { label: 'Area', value: `${sqft.toFixed(1)} sq ft` }, { label: 'Perimeter', value: `${perimeter.toFixed(1)} ft` }, { label: 'Approx. Dimensions (m)', value: `${(v.length * 0.3048).toFixed(1)} × ${(v.width * 0.3048).toFixed(1)} m` }] }
  },
  description: 'Calculate room area in square feet and square meters along with perimeter. Supports rectangular and L-shaped rooms.',
  formula: 'Area = L×W (rect) or L×W×0.85 (L-shape) | Perimeter = 2×(L+W)',
  interpretation: 'Standard room sizes: master bedroom 12×14 ft (168 sq ft), living room 15×20 ft (300 sq ft), bathroom 5×8 ft (40 sq ft). Use area for flooring, paint, furniture planning and heating/cooling calculations.'
}

export default calcDef
