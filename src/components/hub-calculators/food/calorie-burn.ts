import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'met', label: 'Activity MET', type: 'select', options: [
        { label: 'Resting (1.0)', value: '1' }, { label: 'Walking slow (2.5)', value: '2.5' }, { label: 'Walking brisk (3.5)', value: '3.5' },
        { label: 'Cycling leisure (5.0)', value: '5' }, { label: 'Running 10km/h (10.0)', value: '10' }, { label: 'Swimming (6.0)', value: '6' },
        { label: 'HIIT (8.0)', value: '8' }, { label: 'Weight lifting (4.0)', value: '4' }, { label: 'Yoga (2.5)', value: '2.5' },
      ] },
      { name: 'duration', label: 'Duration', type: 'number', unit: 'min', min: 1, step: '1' },
    ],
    compute: (v) => { const kcal = v.weight * v.met * (v.duration / 60); return { result: kcal, label: 'Calories Burned', unit: 'kcal', steps: [
      { label: 'Weight', value: `${v.weight} kg` },
      { label: 'MET value', value: `${v.met}` },
      { label: 'Duration', value: `${v.duration} min = ${(v.duration / 60).toFixed(2)} hr` },
      { label: 'Formula', value: `${v.weight} × ${v.met} × ${(v.duration / 60).toFixed(2)}` },
      { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
    ]} },
    description: 'Calories burned during physical activity calculated using the MET (Metabolic Equivalent of Task) method. MET values from the Compendium of Physical Activities.',
    example: { label: '70kg, brisk walk (3.5 MET), 30 min', value: '~122 kcal' }
}

export default calcDef
