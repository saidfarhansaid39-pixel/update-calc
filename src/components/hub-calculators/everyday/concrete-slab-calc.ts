import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'thickness', label: 'Thickness (in)', type: 'number', min: 2, step: '1' },
  ],
  compute: (v) => {
    const volumeCF = v.length * v.width * (v.thickness / 12)
    const volumeCY = volumeCF / 27
    return { result: volumeCY, label: 'Concrete Volume', unit: 'cu yd', steps: [{ label: 'Volume (cu ft)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Volume (cu yd)', value: `${volumeCY.toFixed(2)} cu yd` }, { label: '80lb Bags', value: `${Math.ceil(volumeCY * 45)} bags (80lb)` }] }
  },
  description: 'Calculate concrete volume needed for slabs, driveways, patios, and foundations. Enter dimensions in feet and inches to get cubic yards and bag estimates.',
  formula: 'Volume (cu yd) = (L × W × T/12) / 27',
  interpretation: 'One cubic yard covers 81 sq ft at 4 in thick. Add 5-10% for waste. Use 4 in for patios/walkways, 6 in for driveways. Rebar or wire mesh recommended for crack control.'
}

export default calcDef
