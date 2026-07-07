import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, step: '1' },
      { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female (19-50)', value: 'female' }, { label: 'Female (51+)', value: 'female51' }, { label: 'Pregnant', value: 'pregnant' }] }
    ],
    compute: (v) => {
      let r = 8; if (v.gender === 'female') r = 18; else if (v.gender === 'female51') r = 8; else if (v.gender === 'pregnant') r = 27; return { result: r, label: 'Daily Iron', unit: 'mg', steps: [{ label: 'Age', value: v.age + ' years' }, { label: 'Life stage', value: v.gender }, { label: 'RDA', value: r + ' mg' }] }
    },
    description: 'Daily iron requirements based on age, gender, and life stage. Iron is crucial for oxygen transport and energy metabolism.',
    example: { label: '30yr female', value: '18 mg/day' }
}

export default calcDef
