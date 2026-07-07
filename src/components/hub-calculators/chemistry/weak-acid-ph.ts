import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ka: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conc', label: 'Weak Acid Concentration', type: 'number', unit: 'M', min: 1e-10, max: 10, step: 'any' },
    { name: 'ka', label: 'Acid Dissociation Constant Ka', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
  ],
  compute: (v) => {
    const hPlus = Math.sqrt(v.ka * v.conc)
    const pH = -Math.log10(hPlus)
    return {
      result: pH, label: 'pH', unit: '',
      steps: [
        { label: '[HA]', value: `${v.conc} M` },
        { label: 'Ka', value: `${v.ka.toExponential(3)}` },
        { label: '[H⁺] ≈ √(Ka × [HA])', value: `${hPlus.toExponential(4)} M` },
        { label: 'pH = -log₁₀[H⁺]', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Weak acids partially dissociate in water. The equilibrium concentration of H⁺ is calculated using the Ka and initial concentration, assuming the 5% approximation holds.',
  formula: '[H⁺] ≈ √(Ka × [HA]₀) | pH = -log₁₀[H⁺]',
  interpretation: 'If [H⁺] / [HA]₀ > 5%, use the quadratic formula instead. Acetic acid (Ka = 1.8 × 10⁻⁵) at 0.1 M gives pH ≈ 2.87. Weak acids have Ka values between 10⁻¹⁶ and 1.'
}

export default calcDef
