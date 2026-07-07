import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meals', label: 'Meals Per Day', type: 'number', min: 1, step: '1' },
      { name: 'days', label: 'Days', type: 'number', min: 1, step: '1' },
      { name: 'people', label: 'People', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.meals * v.days * v.people, label: 'Total Meals', unit: 'meals', steps: [
      { label: 'Meals per day', value: `${v.meals}` },
      { label: 'Number of days', value: `${v.days}` },
      { label: 'People', value: `${v.people}` },
      { label: 'Total meals needed', value: `${v.meals * v.days * v.people}` },
    ]}),
    description: 'Plan your meal prep by calculating the total number of meals needed. Multiply meals per day by days and people for accurate batch cooking.',
    example: { label: '3 meals, 5 days, 2 people', value: '30 total meals' }
}

export default calcDef
