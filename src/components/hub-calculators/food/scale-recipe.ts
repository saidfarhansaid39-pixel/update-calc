import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'originalServings', label: 'Original Servings', type: 'number', min: 1, step: '1' },
      { name: 'desiredServings', label: 'Desired Servings', type: 'number', min: 1, step: '1' },
      { name: 'ingredient', label: 'Ingredient Amount', type: 'number', min: 0, step: '0.25' },
    ],
    compute: (v) => {
      const factor = v.desiredServings / v.originalServings
      return { result: v.ingredient * factor, label: 'Scaled Amount', unit: 'units', steps: [
        { label: 'Original servings', value: `${v.originalServings}` },
        { label: 'Desired servings', value: `${v.desiredServings}` },
        { label: 'Scaling factor', value: `${factor.toFixed(2)}×` },
        { label: 'Original amount', value: `${v.ingredient}` },
        { label: 'Scaled amount', value: `${(v.ingredient * factor).toFixed(2)}` },
      ]}
    },
    description: 'Scale any recipe up or down by adjusting ingredient quantities proportionally. The scaling factor = desired servings ÷ original servings.',
    example: { label: '4 to 6 servings, 200g flour', value: '300g flour (1.5×)' }
}

export default calcDef
