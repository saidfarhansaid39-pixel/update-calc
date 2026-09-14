import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Rectangle', value: 'rect' }, { label: 'Square', value: 'square' }, { label: 'L-Shaped', value: 'lshape' }] },
  ],
  defaults: { length: '15', width: '12', shape: 'rect' },
  presets: [
    { label: 'Master Bedroom', values: { length: '14', width: '12', shape: 'rect' } },
    { label: 'Living Room', values: { length: '20', width: '15', shape: 'rect' } },
    { label: 'L-Shaped Kitchen', values: { length: '18', width: '12', shape: 'lshape' } },
    { label: 'Small Bathroom', values: { length: '8', width: '5', shape: 'rect' } },
  ],
  compute: (v) => {
    let sqft = 0
    if (v.shape === 'rect' || v.shape === 'square') sqft = v.length * v.width
    else sqft = v.length * v.width * 0.85
    const perimeter = 2 * (v.length + v.width)
    return { result: sqft, label: 'Room Area', unit: 'sq ft', steps: [{ label: 'Dimensions', value: `${v.length} × ${v.width} ft` }, { label: 'Area', value: `${sqft.toFixed(1)} sq ft` }, { label: 'Perimeter', value: `${perimeter.toFixed(1)} ft` }, { label: 'Approx. Dimensions (m)', value: `${(v.length * 0.3048).toFixed(1)} × ${(v.width * 0.3048).toFixed(1)} m` }] ,
    extras: [
      { label: 'Average Room Sizes (US)', value: 'Master bedroom: 12×14 ft (168 sq ft). Living room: 15×20 ft (300 sq ft). Kitchen: 10×12 ft (120 sq ft). Bathroom: 5×8 ft (40 sq ft). Closet: 3×6 ft (18 sq ft)' },
      { label: 'Flooring Material Needs', value: 'Order 10% extra for simple shapes, 15-20% for diagonal or L-shaped rooms. Hardwood: add 5% for waste. Tile: add 10-15% for cuts and breakage. Carpet: add 10% for pattern matching' },
      { label: 'Metric Conversion', value: '1 sq ft = 0.0929 sq m. 1 sq m = 10.764 sq ft. A 300 sq ft living room = 27.9 sq m. For metric room dimensions: multiply feet by 0.3048 to get meters' },
      { label: 'L-Shaped Room Measurement', value: 'For accurate L-shaped room area: measure as two rectangles, calculate separately, sum the areas. The 85% approximation is quick but measure actual for furniture' },
      { label: 'Heating/Cooling Sizing', value: 'HVAC: ~20 BTU per sq ft of living space. A 300 sq ft room needs ~6,000 BTU cooling. Multiply room area by 20 for minimum BTUs needed (300 × 20 = 6,000 BTU)' },
      { label: 'Paint Calculation Basis', value: '1 gallon covers ~350 sq ft of wall. Room perimeter × height = wall area. Add ceiling (L×W). For 12×14 ft room with 8 ft ceilings: walls = 416 sq ft, ceiling = 168 sq ft = ~1.7 gallons per coat' },
      { label: 'Electrical/Lighting Load', value: 'General lighting: 3 watts per sq ft. A 300 sq ft room needs minimum 900 watts total lighting capacity. Receptacles: 1 per 12 ft of wall, minimum 2 per room' },
    ]}
  },
  description: 'Calculate room area in square feet with metric conversion and perimeter. Supports rectangular, square, and L-shaped rooms for flooring, paint, and HVAC planning.',
  formula: 'RectArea = Length × Width. LShapedArea = Length × Width × 0.85 (approximation). Perimeter = 2 × (Length + Width). Metric: Length(m) = Length(ft) × 0.3048.',
  interpretation: 'A 15×12 ft rectangular room is 180 sq ft (16.7 sq m) with a 54 ft perimeter. This size works for: medium bedroom, small living room, or large office. Standard US rooms: master bedroom 12-14×14-16 ft (168-224 sq ft), living room 15-20×15-20 ft (225-400 sq ft), kitchen 10-12×12-14 ft (120-168 sq ft). For home improvement projects: flooring needs 10% extra (198 sq ft for a 180 sq ft room), paint needs ~1.5-2 gallons per coat for walls and ceiling, and cooling needs ~3,600 BTU (180 sq ft × 20 BTU/sq ft). L-shaped room area approximation (85%) is rough — measure as separate rectangles for accuracy.'
}

export default calcDef
