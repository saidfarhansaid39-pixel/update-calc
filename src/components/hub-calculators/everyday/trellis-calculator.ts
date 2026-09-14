import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trelWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trelHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trelMaterial: z.string().min(1), trelSpacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'trelWidth', label: 'Trellis Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'trelHeight', label: 'Trellis Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'trelMaterial', label: 'Material', type: 'select', options: [{ label: 'Wood (2x2 lumber)', value: 'wood' }, { label: 'Metal Wire Grid', value: 'wire' }, { label: 'PVC/Plastic', value: 'pvc' }] },
    { name: 'trelSpacing', label: 'Grid Spacing (in)', type: 'number', min: 4, step: '2' },
  ],
  defaults: { trelWidth: '4', trelHeight: '6', trelMaterial: 'wood', trelSpacing: '8' },
  presets: [
    { label: 'Small Cucumber Trellis', values: { trelWidth: '3', trelHeight: '5', trelMaterial: 'wood', trelSpacing: '6' } },
    { label: 'Standard Bean Tower', values: { trelWidth: '4', trelHeight: '6', trelMaterial: 'wood', trelSpacing: '8' } },
    { label: 'Tomato Wall (wide)', values: { trelWidth: '8', trelHeight: '6', trelMaterial: 'wire', trelSpacing: '12' } },
    { label: 'Rose Arch Trellis', values: { trelWidth: '5', trelHeight: '8', trelMaterial: 'pvc', trelSpacing: '10' } },
  ],
  compute: (v) => {
    const verticalCount = Math.ceil((v.trelWidth * 12) / v.trelSpacing) + 1
    const horizontalCount = Math.ceil((v.trelHeight * 12) / v.trelSpacing) + 1
    const verticalFeet = verticalCount * v.trelHeight
    const horizontalFeet = horizontalCount * v.trelWidth
    const totalFeet = verticalFeet + horizontalFeet
    const framePerimeterFt = 2 * (v.trelWidth + v.trelHeight)
    const totalWood = totalFeet + framePerimeterFt
    const screws = Math.ceil(verticalCount * horizontalCount * 0.5)
    return { result: totalWood, label: 'Total Lumber Needed', unit: 'linear ft', steps: [
      { label: 'Formula', value: 'Total = (Verticals × Height) + (Horizontals × Width) + Frame' },
      { label: 'Vertical Runners', value: verticalCount + ' × ' + v.trelHeight + ' ft = ' + verticalFeet + ' ft' },
      { label: 'Horizontal Runners', value: horizontalCount + ' × ' + v.trelWidth + ' ft = ' + horizontalFeet + ' ft' },
      { label: 'Frame Perimeter', value: '2 × (' + v.trelWidth + ' + ' + v.trelHeight + ') = ' + framePerimeterFt.toFixed(1) + ' ft' },
      { label: 'Total Lumber', value: totalWood.toFixed(0) + ' linear ft' },
      { label: 'Screws Needed', value: '~' + screws + ' (galvanized recommended)' },
      { label: 'Intersections', value: verticalCount + ' × ' + horizontalCount + ' = ' + (verticalCount * horizontalCount) + ' joints' },
    ] ,
    extras: [
      { label: 'Crop Spacing', value: 'Cucumbers/beans: 6 in spacing. Tomatoes: 12 in. Peas: 4 in. Melons/squash: 12-18 in for heavy fruit support' },
      { label: 'Wood Selection', value: 'Cedar lasts 5-7 years naturally rot-resistant. Pressure-treated pine: 3-5 years. Avoid treated wood for edible gardens' },
      { label: 'Height Matters', value: 'Tomatoes: 6-8 ft. Cucumbers: 5-6 ft. Pole beans: 6-8 ft. Peas: 4-5 ft. Morning glories: 6-8 ft trellis height' },
      { label: 'Wind Load', value: 'Tall trellises (8+ ft) need anchoring — use T-posts every 4-6 ft or concrete footings in windy areas' },
      { label: 'Material Cost', value: 'Wood trellis: $20-50 for 4×6 ft. Wire grid: $15-30. PVC: $25-45. Cedar costs 2-3× more but lasts longer' },
      { label: 'Seasonal Care', value: 'Apply linseed oil to wood trellises annually. Store PVC/wire indoors in freezing climates to prevent brittleness' },
      { label: 'Heavy Fruits', value: 'Melons, squash, and large pumpkins need additional slings (old t-shirts, pantyhose) to support fruit weight on trellis' },
      { label: 'Trellis Orientation', value: 'North-south orientation maximizes sun exposure on both sides. East-west creates shade — better for cool-season crops' },
    ]}
  },
  description: 'Calculate the lumber, hardware, and material quantities needed for building a garden trellis. Supports wood, metal wire, and PVC materials with customizable grid spacing for different climbing plants.',
  formula: 'Vertical Runners = ceil((Width × 12) ÷ Spacing) + 1. Horizontal Runners = ceil((Height × 12) ÷ Spacing) + 1. Total Lumber = (Verticals × Height) + (Horizontals × Width) + 2 × (Width + Height). Screws ≈ Vertical Count × Horizontal Count ÷ 2.',
  interpretation: 'A standard 4×6 ft trellis with 8 in spacing needs 7 vertical runners (7 × 6 ft = 42 ft), 10 horizontal runners (10 × 4 ft = 40 ft), and 20 ft of frame, totaling ~102 linear ft of lumber and ~35 screws. Grid spacing determines density: 6 in for small plants like peas and beans, 12 in for larger plants like tomatoes and cucumbers.'
}

export default calcDef
