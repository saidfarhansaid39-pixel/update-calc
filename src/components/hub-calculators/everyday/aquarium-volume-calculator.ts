import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tankLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tankWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tankHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [
    { name: 'tankLength', label: 'Tank Length (in)', type: 'number', min: 1, step: '1' },
    { name: 'tankWidth', label: 'Tank Width (in)', type: 'number', min: 1, step: '1' },
    { name: 'tankHeight', label: 'Tank Height (in)', type: 'number', min: 1, step: '1' },
    { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Rectangular', value: 'rect' }, { label: 'Cylindrical', value: 'cyl' }] },
  ],
  compute: (v) => {
    const volCuIn = v.shape === 'cyl' ? Math.PI * (v.tankWidth / 2) ** 2 * v.tankHeight : v.tankLength * v.tankWidth * v.tankHeight
    const gallons = volCuIn / 231
    const liters = gallons * 3.78541
    return { result: gallons, label: 'Water Volume', unit: 'gal', steps: [{ label: 'Cubic Inches', value: `${volCuIn.toFixed(0)} cu in` }, { label: 'Gallons', value: `${gallons.toFixed(1)} gal` }, { label: 'Liters', value: `${liters.toFixed(1)} L` }] }
  },
  description: 'Calculate water volume for rectangular or cylindrical aquariums and fish tanks. Enter dimensions in inches to get gallons and liters.',
  formula: 'Rect: (L×W×H)/231 | Cyl: (π×(W/2)²×H)/231',
  interpretation: 'Displacement from substrate (1 lb/gal), decorations, and equipment reduces usable water by 10-20%. Stocking guideline: 1 gal per inch of fish.'
}

export default calcDef
