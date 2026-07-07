import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'originalServings', label: 'Original Servings', type: 'number', min: 1, step: '1' },
      { name: 'desiredServings', label: 'Desired Servings', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const f = v.desiredServings / v.originalServings; return { result: f, label: 'Scaling Factor', unit: 'x', steps: [{ label: 'Original', value: v.originalServings }, { label: 'Desired', value: v.desiredServings }, { label: 'Factor', value: f.toFixed(2) + 'x' }] }
    },
    description: 'Calculate recipe scaling factor. Multiply each ingredient by this factor.',
    example: { label: '4 to 8 servings', value: '2.0x factor' }
}

export default calcDef
