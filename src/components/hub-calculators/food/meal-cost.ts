import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCost', label: 'Total Meal Cost ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.totalCost / v.servings, label: 'Cost Per Serving', unit: '$', steps: [
      { label: 'Total meal cost', value: `$${v.totalCost.toFixed(2)}` },
      { label: 'Number of servings', value: `${v.servings}` },
      { label: 'Cost per serving', value: `$${(v.totalCost / v.servings).toFixed(2)}` },
    ]}),
    description: 'Calculate the cost per serving of any meal. Understanding your per-meal cost helps with budgeting and comparing homemade vs. dining out.',
    example: { label: '$15 meal, 4 servings', value: '$3.75/serving' }
}

export default calcDef
