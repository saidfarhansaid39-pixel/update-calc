import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'original', label: 'Original Servings', type: 'number', min: 1, step: '1' },
      { name: 'desired', label: 'Desired Servings', type: 'number', min: 1, step: '1' },
      { name: 'ingredient', label: 'Ingredient Amount', type: 'number', min: 0, step: '0.25' }
    ],
    compute: (v) => {
      const f = v.desired / v.original; const r = v.ingredient * f; return { result: r, label: 'Scaled Amount', unit: 'units', steps: [{ label: 'Original', value: v.original + ' servings' }, { label: 'Desired', value: v.desired + ' servings' }, { label: 'Factor', value: f.toFixed(2) + 'x' }, { label: 'Original amount', value: v.ingredient }, { label: 'Scaled', value: r.toFixed(2) }] }
    },
    description: 'Scale recipe ingredient quantities up or down based on desired servings.',
    example: { label: '4 to 6 servings, 200g flour', value: '300g (1.5x)' }
}

export default calcDef
