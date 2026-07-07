import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'ingredientCosts', label: 'Total Cost of Ingredients ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'portion', label: 'Portion Size', type: 'select', options: [{ label: 'Standard serving', value: '1' }, { label: 'Half serving', value: '0.5' }, { label: 'Double serving', value: '2' }] },
    ],
    compute: (v) => ({ result: v.ingredientCosts / v.servings * v.portion, label: 'Cost Per Serving', unit: '$', steps: [
      { label: 'Total ingredient cost', value: `$${v.ingredientCosts.toFixed(2)}` },
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Portion multiplier', value: `${v.portion}×` },
      { label: 'Cost per serving', value: `$${(v.ingredientCosts / v.servings * v.portion).toFixed(2)}` },
    ]}),
    description: 'Calculate the exact cost per serving including portion adjustments. Perfect for meal prepping and comparing recipe costs across different serving sizes.',
    example: { label: '$25 ingredients, 4 servings, standard', value: '$6.25/serving' }
}

export default calcDef
