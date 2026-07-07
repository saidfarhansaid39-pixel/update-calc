import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Pregnant', value: 'pregnant' }, { label: 'Lactating', value: 'lactating' }] }
    ],
    compute: (v) => {
      const rda = v.age < 1 ? 200 : v.age < 4 ? 700 : v.age < 9 ? 1000 : v.age < 19 ? 1300 : v.age < 51 ? 1000 : 1200; const adj = v.gender === 'pregnant' ? rda + 200 : v.gender === 'lactating' ? rda + 300 : rda; return { result: adj, label: 'Daily Calcium', unit: 'mg', steps: [{ label: 'Age', value: v.age + ' years' }, { label: 'RDA', value: rda + ' mg' }, { label: 'Adjusted', value: adj + ' mg' }] }
    },
    description: 'Daily calcium requirements based on age and life stage. Calcium is essential for bone health, muscle function, and nerve transmission.',
    example: { label: '30yr female', value: '1,000 mg/day' }
}

export default calcDef
