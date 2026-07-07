import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ka1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conc', label: 'Polyprotic Acid Concentration', type: 'number', unit: 'M', min: 1e-10, max: 10, step: 'any' },
    { name: 'ka1', label: 'First Dissociation Constant Ka₁', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
  ],
  compute: (v) => {
    const hPlus = Math.sqrt(v.ka1 * v.conc)
    const pH = -Math.log10(hPlus)
    return {
      result: pH, label: 'pH (approximate, dominated by Ka₁)', unit: '',
      steps: [
        { label: 'Concentration', value: `${v.conc} M` },
        { label: 'Ka₁', value: `${v.ka1.toExponential(3)}` },
        { label: '[H⁺] ≈ √(Ka₁ × C)', value: `${hPlus.toExponential(4)} M` },
        { label: 'pH', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Polyprotic acids (e.g., H₃PO₄, H₂CO₃) have multiple dissociations. The pH is usually determined primarily by the first dissociation unless Ka₁ and Ka₂ are close.',
  formula: '[H⁺] ≈ √(Ka₁ × C) when Ka₂ ≪ Ka₁',
  interpretation: 'For phosphoric acid (H₃PO₄): Ka₁ = 7.5 × 10⁻³, Ka₂ = 6.2 × 10⁻⁸, Ka₃ = 4.8 × 10⁻¹³. Since Ka₁ ≫ Ka₂, the first dissociation dominates pH. Each proton dissociates sequentially.'
}

export default calcDef
