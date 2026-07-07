import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'diet', label: 'Diet Type', type: 'select', options: [{ label: 'Omnivore', value: '1' }, { label: 'Vegetarian', value: '1.5' }, { label: 'Vegan', value: '2.5' }] }
    ],
    compute: (v) => {
      const b = v.age < 1 ? 0.4 : v.age < 4 ? 0.9 : v.age < 9 ? 1.2 : v.age < 14 ? 1.8 : 2.4; const r = b * v.diet; return { result: r, label: 'Vitamin B12', unit: 'mcg/day', steps: [{ label: 'Age RDA', value: b + ' mcg' }, { label: 'Diet adjustment', value: v.diet + 'x' }, { label: 'Recommended', value: r.toFixed(1) + ' mcg/day' }] }
    },
    description: 'Vitamin B12 needs based on age and diet. B12 is found naturally in animal products; vegans may need supplementation.',
    example: { label: '30yr vegan', value: '6.0 mcg/day' }
}

export default calcDef
