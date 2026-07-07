import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    rdsRate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    rdsOrder: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1 && parseInt(v) <= 2, '1 or 2'),
    preEqConst: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'rdsRate', label: 'Rate Constant of RDS (k_RDS)', type: 'number', unit: 'varies', min: 0.0001, step: 'any' },
    { name: 'rdsOrder', label: 'Molecularity of RDS', type: 'number', unit: '', min: 1, max: 2, step: '1' },
    { name: 'preEqConst', label: 'Pre-equilibrium Constant (K_eq)', type: 'number', unit: '', min: 1e-20, step: 'any' },
  ],
  compute: (v) => {
    const overallK = v.rdsRate * v.preEqConst
    const obsOrder = v.rdsOrder === 1 ? 1 : 2
    return {
      result: overallK, label: 'Overall Observed Rate Constant', unit: 'varies',
      steps: [
        { label: 'k_RDS (rate-determining step)', value: `${v.rdsRate.toExponential(4)}` },
        { label: 'Molecularity of RDS', value: v.rdsOrder === 1 ? 'Unimolecular' : 'Bimolecular' },
        { label: 'Pre-equilibrium K', value: `${v.preEqConst.toExponential(4)}` },
        { label: 'Overall k_obs = k_RDS × K_eq', value: `${overallK.toExponential(4)}` },
        { label: 'Overall reaction order', value: `${obsOrder}` },
      ]
}
  },
  description: 'A reaction mechanism consists of elementary steps. The rate-determining step (RDS) — the slowest step — governs the overall rate. Pre-equilibrium steps affect the observed rate constant.',
  formula: 'Overall rate = k_RDS × K_eq × [reactant]ⁿ | Rate determined by slowest elementary step',
  interpretation: 'For a mechanism with a fast pre-equilibrium followed by a slow RDS, k_obs = k_RDS × K_eq. The molecularity of the RDS equals the number of molecules in that step. Unimolecular RDS = first-order overall.'
}

export default calcDef
