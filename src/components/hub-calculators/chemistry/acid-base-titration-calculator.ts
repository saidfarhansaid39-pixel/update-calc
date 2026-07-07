import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mAcid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vAcid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vBase: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mAcid', label: 'Known Acid Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'vAcid', label: 'Volume of Acid Used', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'vBase', label: 'Volume of Base at Equivalence', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const mBase = v.mAcid * v.vAcid / v.vBase
    return {
      result: mBase, label: 'Unknown Base Molarity', unit: 'M',
      steps: [
        { label: 'M₁V₁ = M₂V₂', value: `${v.mAcid} × ${v.vAcid} = M₂ × ${v.vBase}` },
        { label: 'M₂ = M₁V₁ / V₂', value: `${mBase.toFixed(4)} M` },
      ]
}
  },
  description: 'Acid-base titration determines the concentration of an unknown solution by reacting it with a solution of known concentration until the equivalence point is reached.',
  formula: 'M₁V₁ = M₂V₂',
  interpretation: 'At the equivalence point, moles of H⁺ = moles of OH⁻. For a 1:1 reaction, M₁V₁ = M₂V₂, where M and V are the molarity and volume of acid and base.'
}

export default calcDef
