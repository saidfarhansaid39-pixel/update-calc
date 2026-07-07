import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'meals', label: 'Meals Per Day', type: 'number', min: 1, step: '1' },
      { name: 'sodiumPerMeal', label: 'Sodium Per Meal', type: 'number', unit: 'mg', min: 0, step: '50' },
      { name: 'snacks', label: 'Snacks Sodium', type: 'number', unit: 'mg', min: 0, step: '25' }
    ],
    compute: (v) => {
      const t = v.meals * v.sodiumPerMeal + v.snacks; const l = 2300; const p = (t / l * 100).toFixed(0); return { result: t, label: 'Total Sodium', unit: 'mg', steps: [{ label: 'Meals', value: v.meals + ' x ' + v.sodiumPerMeal + ' mg' }, { label: 'Snacks', value: v.snacks + ' mg' }, { label: 'Total', value: t.toFixed(0) + ' mg (' + p + '% DV)' }, t > l ? { label: 'Over limit', value: 'Reduce by ' + (t - l).toFixed(0) + ' mg' } : { label: 'Within limit', value: (l - t).toFixed(0) + ' mg remaining' }] }
    },
    description: 'Track daily sodium against the 2,300 mg limit. High sodium is linked to hypertension and heart disease.',
    example: { label: '3 meals x 600mg + 200mg snacks', value: '2,000 mg (87% DV)' }
}

export default calcDef
