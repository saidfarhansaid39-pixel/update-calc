import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'factor', label: 'Activity Factor', type: 'select', options: [
        { label: 'Sedentary (0.8 g/kg)', value: '0.8' }, { label: 'Moderate (1.2 g/kg)', value: '1.2' },
        { label: 'Active (1.6 g/kg)', value: '1.6' }, { label: 'Athlete (2.0 g/kg)', value: '2' },
        { label: 'Bodybuilder (2.2 g/kg)', value: '2.2' },
      ] },
    ],
    compute: (v) => ({ result: v.weight * v.factor, label: 'Daily Protein', unit: 'g', steps: [
      { label: 'Body weight', value: `${v.weight} kg` },
      { label: 'Activity factor', value: `${v.factor} g/kg` },
      { label: 'Recommended protein', value: `${(v.weight * v.factor).toFixed(0)} g/day` },
    ]}),
    description: 'Protein needs based on body weight and activity level. RDA is 0.8 g/kg for sedentary individuals, while athletes may need up to 2.2 g/kg for muscle repair.',
    example: { label: '70kg, active (1.6 g/kg)', value: '112g protein/day' }
}

export default calcDef
