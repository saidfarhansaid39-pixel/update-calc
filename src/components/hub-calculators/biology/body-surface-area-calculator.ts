import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.1' },
    { name: 'height', label: 'Height', type: 'number', unit: 'cm', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const bsa = Math.sqrt(v.weight * v.height / 3600)
    return {
      result: bsa, label: 'Body Surface Area', unit: 'm²',
      steps: [
        { label: 'Weight', value: `${v.weight} kg` },
        { label: 'Height', value: `${v.height} cm` },
        { label: 'BSA (Mosteller)', value: `${bsa.toFixed(2)} m²` },
        { label: 'Reference range', value: 'Adult BSA ~1.7–2.0 m²' },
      ]
}
  },
  description: 'Body Surface Area (BSA) is used in medical dosing for chemotherapy, IV fluids, and burn assessment. The Mosteller formula is the most widely used in clinical practice.',
  formula: 'BSA = v(weight × height / 3600) (Mosteller)',
  interpretation: 'Normal adult BSA is ~1.7–2.0 m². BSA is used for chemotherapy dosing, burn surface area estimation, and cardiac output indexing.'
}

export default calcDef
