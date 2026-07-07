import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conc', label: 'Weak Base Concentration', type: 'number', unit: 'M', min: 1e-10, max: 10, step: 'any' },
    { name: 'kb', label: 'Base Dissociation Constant Kb', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
  ],
  compute: (v) => {
    const ohMinus = Math.sqrt(v.kb * v.conc)
    const pOH = -Math.log10(ohMinus)
    const pH = 14 - pOH
    return {
      result: pH, label: 'pH', unit: '',
      steps: [
        { label: '[B]', value: `${v.conc} M` },
        { label: 'Kb', value: `${v.kb.toExponential(3)}` },
        { label: '[OH⁻] ≈ √(Kb × [B])', value: `${ohMinus.toExponential(4)} M` },
        { label: 'pOH = -log₁₀[OH⁻]', value: pOH.toFixed(2) },
        { label: 'pH = 14 − pOH', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Weak bases partially dissociate in water. The equilibrium concentration of OH⁻ is calculated using Kb and the initial concentration of the base.',
  formula: '[OH⁻] ≈ √(Kb × [B]₀) | pH = 14 + log₁₀[OH⁻]',
  interpretation: 'Ammonia (NH₃, Kb = 1.8 × 10⁻⁵) at 0.1 M gives pH ≈ 11.13. Ka × Kb = Kw = 1.0 × 10⁻¹⁴ at 25°C. For the conjugate acid of a weak base, Ka = Kw / Kb.'
}

export default calcDef
