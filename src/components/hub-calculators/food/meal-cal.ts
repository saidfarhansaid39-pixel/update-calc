import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCal', label: 'Total Meal Calories', type: 'number', min: 0, step: '1' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.totalCal / v.servings, label: 'Calories Per Serving', unit: 'kcal', steps: [
      { label: 'Total meal calories', value: `${v.totalCal} kcal` },
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Per serving', value: `${(v.totalCal / v.servings).toFixed(0)} kcal` },
      { label: 'Daily % (2000 kcal diet)', value: `${(v.totalCal / v.servings / 2000 * 100).toFixed(0)}% of daily intake` },
    ]}),
    description: 'Quick meal calorie calculation. Simply enter the total calories of a complete meal and divide by servings to understand individual portions.',
    example: { label: '800 kcal meal, 2 servings', value: '400 kcal/serving (20% daily)' }
}

export default calcDef
