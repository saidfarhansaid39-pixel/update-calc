import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'neck', label: 'Neck Circumference', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 20, step: '0.5' },
      { name: 'waist', label: 'Waist Circumference', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 50, step: '0.5' },
      { name: 'hip', label: 'Hip Circumference', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 50, step: '0.5' },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 100, step: '0.5' },
    ],
    compute: (v) => {
      const bf = 495 / (1.0324 - 0.19077 * Math.log10(v.waist - v.neck) + 0.15456 * Math.log10(v.height)) - 450
      return { result: Math.max(3, bf), label: 'Body Fat %', unit: '%', steps: [
        { label: 'Neck', value: `${v.neck} cm` },
        { label: 'Waist', value: `${v.waist} cm` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'Formula (US Navy)', value: `495 / (1.0324 - 0.19077 × log10(${v.waist} - ${v.neck}) + 0.15456 × log10(${v.height})) - 450` },
        { label: 'Estimated body fat', value: `${bf.toFixed(1)}%` },
      ]}
    },
    description: 'Body fat percentage using the US Navy circumference method. This method uses neck, waist, and height measurements and is accurate within 3-4% of hydrostatic weighing.',
    example: { label: 'Neck 38cm, Waist 85cm, Height 175cm', value: '~15.6% body fat' }
}

export default calcDef
