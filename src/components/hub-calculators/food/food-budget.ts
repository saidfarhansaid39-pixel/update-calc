import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weekly', label: 'Weekly Budget ($)', type: 'number', min: 0, step: '5' },
      { name: 'weeks', label: 'Weeks', type: 'number', min: 1, step: '1' },
      { name: 'people', label: 'People in Household', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.weekly * v.weeks * v.people, label: 'Total Food Budget', unit: '$', steps: [
      { label: 'Weekly budget per person', value: `$${v.weekly.toFixed(2)}` },
      { label: 'Household size', value: `${v.people} people` },
      { label: 'Duration', value: `${v.weeks} weeks` },
      { label: 'Total budget', value: `$${(v.weekly * v.weeks * v.people).toFixed(2)}` },
    ]}),
    description: 'Plan your food budget over multiple weeks for your household. USDA recommends spending 10-15% of income on food for a balanced budget.',
    example: { label: '$150/week, 4 weeks, 2 people', value: '$1,200 total' }
}

export default calcDef
