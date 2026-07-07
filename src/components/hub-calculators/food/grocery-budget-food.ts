import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalBudget', label: 'Total Monthly Budget ($)', type: 'number', min: 0, step: '10' },
      { name: 'tripsPerMonth', label: 'Grocery Trips Per Month', type: 'number', min: 1, step: '1' },
      { name: 'household', label: 'Household Size', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.totalBudget / v.tripsPerMonth, label: 'Per Trip Budget', unit: '$', steps: [
      { label: 'Monthly budget', value: `$${v.totalBudget.toFixed(2)}` },
      { label: 'Grocery trips', value: `${v.tripsPerMonth} per month` },
      { label: 'Household size', value: `${v.household} people` },
      { label: 'Per trip budget', value: `$${(v.totalBudget / v.tripsPerMonth).toFixed(2)}` },
      { label: 'Per person per trip', value: `$${(v.totalBudget / v.tripsPerMonth / v.household).toFixed(2)}` },
    ]}),
    description: 'Plan your grocery budget by dividing the monthly food budget across shopping trips. Track spending per household member to stay on target with your food budget.',
    example: { label: '$600/month, 4 trips, 2 people', value: '$150/trip ($75/person)' }
}

export default calcDef
