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
      ],
    extras: [
      { label: "Serving note", value: "Adjust quantities based on number of servings needed." },
      { label: "Dietary note", value: "Consult a dietitian for personalized nutritional advice." },
      { label: "Substitution tip", value: "Substitutions may alter taste, texture, and nutritional content." }
    ]}
    },
    description: 'Scale any recipe up or down by adjusting ingredient quantities proportionally. The scaling factor = desired servings ÷ original servings.',
    example: { label: '4 to 6 servings, 200g flour', value: '300g flour (1.5×)' }
}

export default calcDef
