import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
const genderOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0), age: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }), gender: z.string(), timeMin: z.string().min(1).refine(v => parseFloat(v) > 0), hrEnd: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: genderOptions },
    { name: 'timeMin', label: '1-Mile Walk Time', type: 'number', unit: 'min', min: 8, step: '0.1' },
    { name: 'hrEnd', label: 'End Heart Rate', type: 'number', unit: 'bpm', min: 60, step: '1' },
  ],
  compute: (v) => {
    const isMale = v.gender === 2 ? 0 : 1; const vo2 = 132.853 - 0.0769*v.weight - 0.3877*v.age + 6.315*isMale - 3.2649*v.timeMin - 0.1565*v.hrEnd
    return { result: vo2, label: 'Estimated VO2max', unit: 'mL/kg/min', steps: [
      { label: 'Walk time', value: v.timeMin+' min' }, { label: 'End HR', value: v.hrEnd+' bpm' },
      { label: 'VO2max', value: vo2.toFixed(1)+' mL/kg/min' },
      { label: 'Fitness', value: vo2 > 45 ? 'Excellent' : vo2 > 38 ? 'Good' : vo2 > 30 ? 'Average' : 'Below Average' },
    ]}
  }, description: 'Estimate VO2max from the Rockport 1-mile Fitness Walking Test. Safe submaximal test for most populations.', formula: 'VO2max = 132.853 - 0.0769W - 0.3877A + 6.315G - 3.2649T - 0.1565HR', interpretation: 'Higher VO2max indicates better cardiovascular fitness. Valid for sedentary to moderately active adults.'
}

export default calcDef
