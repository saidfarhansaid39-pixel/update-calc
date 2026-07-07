import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mAcid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vAcid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mBase: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mAcid', label: 'Acid Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'vAcid', label: 'Volume of Acid', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'mBase', label: 'Base Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const molH = v.mAcid * v.vAcid / 1000
    const vBase = molH / v.mBase * 1000
    return {
      result: vBase, label: 'Volume of Base Needed', unit: 'mL',
      steps: [
        { label: 'Moles of H⁺', value: `${molH.toFixed(6)} mol` },
        { label: 'Base concentration', value: `${v.mBase} M` },
        { label: 'V_base = moles / M_base', value: `${vBase.toFixed(2)} mL` },
      ]
}
  },
  description: 'Acid-base stoichiometry uses the neutralization reaction H⁺ + OH⁻ → H₂O to find the volume of base required to completely neutralize a given acid solution.',
  formula: 'M_acid × V_acid = M_base × V_base',
  interpretation: 'For monoprotic acids, moles H⁺ = moles OH⁻ at equivalence. For diprotic acids like H₂SO₄, each mole provides 2 moles of H⁺.'
}

export default calcDef
