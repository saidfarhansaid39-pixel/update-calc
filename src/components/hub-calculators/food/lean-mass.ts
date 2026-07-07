import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
      { name: 'bf', label: 'Body Fat %', type: 'number', unit: '%', min: 3, max: 60, step: '0.1' },
    ],
    compute: (v) => {
      const lbm = v.weight * (1 - v.bf / 100); const fatMass = v.weight - lbm
      return { result: lbm, label: 'Lean Body Mass', unit: 'kg', steps: [
        { label: 'Total weight', value: `${v.weight} kg` },
        { label: 'Body fat percentage', value: `${v.bf}%` },
        { label: 'Fat mass', value: `${fatMass.toFixed(1)} kg` },
        { label: 'Lean body mass', value: `${lbm.toFixed(1)} kg` },
      ]}
    },
    description: 'Lean Body Mass (LBM) is your total weight minus fat mass. LBM includes muscle, bone, organs, and water. Tracking LBM is more useful than weight alone for fitness progress.',
    example: { label: '80kg, 15% body fat', value: '68 kg LBM, 12 kg fat mass' }
}

export default calcDef
