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
  compute: (v) => {
    const verticalCount = Math.ceil((v.trelWidth * 12) / v.trelSpacing) + 1
    const horizontalCount = Math.ceil((v.trelHeight * 12) / v.trelSpacing) + 1
    const verticalFeet = verticalCount * v.trelHeight
    const horizontalFeet = horizontalCount * v.trelWidth
    const totalFeet = verticalFeet + horizontalFeet
    const framePerimeterFt = 2 * (v.trelWidth + v.trelHeight)
    const totalWood = totalFeet + framePerimeterFt
    const screws = Math.ceil(verticalCount * horizontalCount * 0.5)
    return { result: totalWood, label: 'Total Lumber Needed', unit: 'linear ft', steps: [{ label: 'Vertical', value: verticalCount + ' x ' + v.trelHeight + ' ft = ' + verticalFeet + ' ft' }, { label: 'Horizontal', value: horizontalCount + ' x ' + v.trelWidth + ' ft = ' + horizontalFeet + ' ft' }, { label: 'Frame Perimeter', value: framePerimeterFt.toFixed(1) + ' ft' }, { label: 'Total Lumber', value: totalWood.toFixed(0) + ' ft' }, { label: 'Screws Needed', value: '~' + screws }] }
  },
  description: 'Calculate lumber, wire, and hardware needed for building a garden trellis. Supports various sizes and materials.',
  formula: 'Vertical = ceil(Wx12/Spacing)+1 | Horizontal = ceil(Hx12/Spacing)+1 | Total = (VxH) + (HxW) + Frame',
  interpretation: 'Standard trellis: 4-8 ft tall, 3-6 ft wide. Grid spacing: 6-12 in (cucumbers, beans: 6 in; tomatoes: 12 in). Cedar or pressure-treated wood lasts 3-5 years. Use galvanized screws for weather resistance.'
}

export default calcDef
