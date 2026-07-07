import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'ingredients', label: 'Number of Ingredients', type: 'number', min: 1, step: '1' },
      { name: 'totalCost', label: 'Total Ingredient Cost ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.totalCost / v.servings, label: 'Cost Per Serving', unit: '$', steps: [
      { label: 'Total ingredients', value: `${v.ingredients} items at $${v.totalCost.toFixed(2)}` },
      { label: 'Number of servings', value: `${v.servings}` },
      { label: 'Cost per serving', value: `$${(v.totalCost / v.servings).toFixed(2)}` },
    ]}),
    description: 'Calculate the exact cost per serving of any recipe. Track ingredient spending and price your homemade meals against restaurant alternatives.',
    example: { label: '10 ingredients, $25 total, 4 servings', value: '$6.25/serving' }
}

export default calcDef
