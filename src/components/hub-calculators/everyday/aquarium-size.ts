import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), width: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'length', label: 'Length (inches)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (inches)', type: 'number', min: 1, step: '1' },
    { name: 'height', label: 'Height (inches)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const volCuIn = v.length * v.width * v.height
    const gallons = volCuIn / 231
    const liters = gallons * 3.785
    return { result: gallons, label: 'Tank Volume', unit: 'gal', steps: [{ label: 'Cubic Inches', value: `${volCuIn.toFixed(0)} cu in` }, { label: 'Gallons', value: `${gallons.toFixed(1)} gal` }, { label: 'Liters', value: `${liters.toFixed(1)} L` }] }
  },
  description: 'Calculate aquarium volume in gallons and liters from length, width, and height dimensions. Account for rectangular tank shapes.',
  formula: 'Volume (gal) = (L × W × H) / 231',
  interpretation: 'Subtract 10-15% for displacement from gravel, decorations, and equipment. Standard tank sizes: 10gal (20×10×12), 20gal (24×12×16), 55gal (48×13×21).'
}

export default calcDef
