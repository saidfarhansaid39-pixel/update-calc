import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    metalConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ligandConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kf: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'metalConc', label: 'Initial Metal Ion Concentration', type: 'number', unit: 'M', min: 1e-10, step: 'any' },
    { name: 'ligandConc', label: 'Initial Ligand Concentration', type: 'number', unit: 'M', min: 1e-10, step: 'any' },
    { name: 'kf', label: 'Formation Constant Kf', type: 'number', unit: '', min: 1e-30, step: 'any' },
  ],
  compute: (v) => {
    const limiting = Math.min(v.metalConc, v.ligandConc)
    const remaining = Math.max(v.metalConc, v.ligandConc) - limiting
    const bound = limiting
    return {
      result: bound, label: 'Concentration of Complex Formed', unit: 'M',
      steps: [
        { label: 'Metal concentration', value: `${v.metalConc.toExponential(4)} M` },
        { label: 'Ligand concentration', value: `${v.ligandConc.toExponential(4)} M` },
        { label: 'Kf', value: `${v.kf.toExponential(4)}` },
        { label: 'Complex formed (assuming 1:1)', value: `${bound.toExponential(4)} M` },
        { label: 'Excess species', value: `${remaining.toExponential(4)} M` },
      ]
}
  },
  description: 'Complex ion formation involves a central metal ion surrounded by ligands. The formation constant (Kf) quantifies the stability of the complex.',
  formula: 'Mⁿ⁺ + L ⇌ MLⁿ⁺ | Kf = [MLⁿ⁺] / ([Mⁿ⁺][L])',
  interpretation: 'High Kf values (e.g., Ag(NH₃)₂⁺, Kf = 1.6 × 10⁷) indicate very stable complexes. Low Kf values indicate weak complexes. Complexation can dramatically change solubility and reactivity.'
}

export default calcDef
