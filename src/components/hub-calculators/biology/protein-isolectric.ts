import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    aspGlu: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    lysArg: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    hisCount: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'aspGlu', label: 'Asp + Glu (acidic)', type: 'number', min: 0, step: '1' },
    { name: 'lysArg', label: 'Lys + Arg (basic)', type: 'number', min: 0, step: '1' },
    { name: 'hisCount', label: 'Histidine (His)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const netCharge = v.lysArg + v.hisCount * 0.5 - v.aspGlu
    const pIest = netCharge > 0 ? 7.0 + netCharge * 0.5 : netCharge < 0 ? 7.0 + netCharge * 0.5 : 7.0
    const clampedPI = Math.max(1, Math.min(14, pIest))
    return {
      result: clampedPI, label: 'Estimated Isoelectric Point (pI)', unit: '',
      steps: [
        { label: 'Acidic residues (D+E)', value: `${v.aspGlu}` },
        { label: 'Basic residues (K+R)', value: `${v.lysArg}` },
        { label: 'His residues', value: `${v.hisCount}` },
        { label: 'Net charge proxy at pH 7', value: `${netCharge.toFixed(1)}` },
        { label: 'Estimated pI', value: `${clampedPI.toFixed(2)}` },
      ]
}
  },
  description: 'The isoelectric point (pI) is the pH at which a protein carries no net electrical charge. It is critical for IEF, 2D electrophoresis, and protein purification by ion exchange chromatography.',
  formula: 'pI ˜ pH where net charge = 0. Estimate based on acidic (pKa ~4) vs basic (pKa ~10-12) residue counts.',
  interpretation: 'At pH < pI: positively charged (binds cation exchangers). At pH > pI: negatively charged (binds anion exchangers). Most proteins have pI between 4 and 8.'
}

export default calcDef
