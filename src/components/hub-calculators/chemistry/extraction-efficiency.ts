import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vOrg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vAq: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'k', label: 'Partition Coefficient (K = C_org / C_aq)', type: 'number', unit: '', min: 0.001, step: '0.1' },
    { name: 'vOrg', label: 'Volume of Organic Phase', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'vAq', label: 'Volume of Aqueous Phase', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const q = 1 / (1 + v.k * v.vOrg / v.vAq)
    const eff = (1 - q) * 100
    return {
      result: eff, label: 'Extraction Efficiency (Single Extraction)', unit: '%',
      steps: [
        { label: 'Partition coefficient K', value: `${v.k.toFixed(2)}` },
        { label: 'V_org', value: `${v.vOrg} mL` },
        { label: 'V_aq', value: `${v.vAq} mL` },
        { label: 'Fraction remaining in aqueous q = 1/(1 + K·V_org/V_aq)', value: `${q.toFixed(4)}` },
        { label: 'Efficiency = (1 - q) × 100%', value: `${eff.toFixed(2)}%` },
      ]
}
  },
  description: 'Liquid-liquid extraction efficiency depends on the partition coefficient (K) and the relative volumes of the organic and aqueous phases. Multiple smaller extractions are more efficient than one large extraction.',
  formula: 'q = 1 / (1 + K × V_org / V_aq) | Efficiency = (1 - q) × 100%',
  interpretation: 'For K = 10 and equal volumes, a single extraction recovers ~91%. Three extractions with 1/3 the solvent each recover ~99.9% — more efficient than one extraction with all the solvent. Multiple small extractions are always more efficient.'
}

export default calcDef
