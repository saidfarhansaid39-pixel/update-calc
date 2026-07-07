import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Round', value: 'round' }, { label: 'Square', value: 'square' }, { label: 'Rectangular', value: 'rect' }] },
      { name: 'dim1', label: 'Length/Diameter', type: 'number', unit: 'in', min: 4, step: '1' },
      { name: 'dim2', label: 'Width (if rect)', type: 'number', unit: 'in', min: 4, step: '1' },
      { name: 'depth', label: 'Depth', type: 'number', unit: 'in', min: 1, step: '0.5' }
    ],
    compute: (v) => {
      let a; if (v.shape === 'round') { a = Math.PI * Math.pow(v.dim1 / 2, 2); } else if (v.shape === 'square') { a = v.dim1 * v.dim1; } else { a = v.dim1 * v.dim2; } const vol = a * v.depth; const cups = vol * 0.069; return { result: cups, label: 'Pan Volume', unit: 'cups', steps: [{ label: 'Shape', value: v.shape }, { label: 'Area', value: a.toFixed(1) + ' sq in' }, { label: 'Volume', value: vol.toFixed(1) + ' cu in' }, { label: 'Capacity', value: cups.toFixed(1) + ' cups' }] }
    },
    description: 'Calculate cake pan volume. Helps determine batter needed and find substitute pans.',
    example: { label: '9" round, 2" deep', value: '~6.4 cups' }
}

export default calcDef
