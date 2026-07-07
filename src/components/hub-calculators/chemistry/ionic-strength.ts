import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    c1: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    z1: z.string().min(1, 'Required').refine(v => parseInt(v) >= -4 && parseInt(v) <= 4, '-4 to +4'),
    c2: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    z2: z.string().min(1, 'Required').refine(v => parseInt(v) >= -4 && parseInt(v) <= 4, '-4 to +4')
}),
  fields: [
    { name: 'c1', label: 'Concentration of Ion 1 (C₁)', type: 'number', unit: 'M', min: 0, step: '0.01' },
    { name: 'z1', label: 'Charge of Ion 1 (z₁)', type: 'number', unit: '', min: -4, max: 4, step: '1' },
    { name: 'c2', label: 'Concentration of Ion 2 (C₂)', type: 'number', unit: 'M', min: 0, step: '0.01' },
    { name: 'z2', label: 'Charge of Ion 2 (z₂)', type: 'number', unit: '', min: -4, max: 4, step: '1' },
  ],
  compute: (v) => {
    const I = 0.5 * (v.c1 * Math.pow(v.z1, 2) + v.c2 * Math.pow(v.z2, 2))
    return {
      result: I, label: 'Ionic Strength (I)', unit: 'M',
      steps: [
        { label: 'Ion 1: c × z²', value: `${v.c1} × ${Math.pow(v.z1, 2)}` },
        { label: 'Ion 2: c × z²', value: `${v.c2} × ${Math.pow(v.z2, 2)}` },
        { label: 'I = ½ Σ cᵢzᵢ²', value: `½ × ${(v.c1 * Math.pow(v.z1, 2) + v.c2 * Math.pow(v.z2, 2)).toFixed(4)}` },
        { label: 'Ionic strength', value: `${I.toFixed(4)} M` },
      ]
}
  },
  description: 'Ionic strength (I) measures the total concentration of ions in solution, weighted by their charge squared: I = ½ Σ cᵢzᵢ². It determines activity coefficients and affects reaction rates and equilibrium.',
  formula: 'I = ½ Σ(cᵢ × zᵢ²) | For 1:1 electrolyte (NaCl): I = c | For 2:1 (CaCl₂): I = 3c | For 2:2 (MgSO₄): I = 4c',
  interpretation: 'Seawater has I ≈ 0.7 M. Physiological saline has I ≈ 0.15 M. Higher ionic strength decreases activity coefficients and screens electrostatic interactions between ions.'
}

export default calcDef
