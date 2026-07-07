import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Food Weight', type: 'number', unit: 'g', units: [{ value: 'g', label: 'g' }, { value: 'oz', label: 'oz' }, { value: 'lb', label: 'lb' }], defaultUnit: 'g', min: 0, step: '10' },
      { name: 'method', label: 'Cooking Method', type: 'select', options: [
        { label: 'Roast 180°C (20 min/500g)', value: '20' }, { label: 'Roast 200°C (18 min/500g)', value: '18' },
        { label: 'Bake 160°C (25 min/500g)', value: '25' }, { label: 'Grill (15 min/500g)', value: '15' },
        { label: 'Steam (12 min/500g)', value: '12' }, { label: 'Boil (10 min/500g)', value: '10' },
      ] },
    ],
    compute: (v) => ({ result: (v.weight / 500) * v.method, label: 'Cooking Time', unit: 'min', steps: [
      { label: 'Food weight', value: `${v.weight} g` },
      { label: 'Method factor', value: `${v.method} min per 500g` },
      { label: 'Estimated time', value: `${((v.weight / 500) * v.method).toFixed(0)} min` },
    ]}),
    description: 'Estimate cooking time based on food weight and method. Times are guidelines — always use a meat thermometer for safety: 74°C for poultry, 63°C for beef.',
    example: { label: '1000g chicken, roast 180°C', value: '40 min' }
}

export default calcDef
