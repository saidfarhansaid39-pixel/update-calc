import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'diet', label: 'Diet', type: 'select', options: [{ label: 'Omnivore', value: '1' }, { label: 'Vegetarian/Vegan', value: '1.5' }] }
    ],
    compute: (v) => {
      const rda = v.age < 1 ? 3 : v.age < 4 ? 3 : v.age < 9 ? 5 : v.age < 14 ? 8 : 11; const r = Math.round(rda * v.diet); return { result: r, label: 'Daily Zinc', unit: 'mg', steps: [{ label: 'Age RDA', value: rda + ' mg' }, { label: 'Diet factor', value: v.diet + 'x' }, { label: 'Recommended', value: r + ' mg' }] }
    },
    description: 'Daily zinc requirements based on age and diet. Zinc supports immune function, wound healing, and DNA synthesis.',
    example: { label: '30yr vegetarian', value: '16 mg/day' }
}

export default calcDef
