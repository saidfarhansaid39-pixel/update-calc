import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conc', label: 'Strong Acid Concentration', type: 'number', unit: 'M', min: 1e-14, max: 10, step: 'any' },
  ],
  compute: (v) => {
    const pH = -Math.log10(v.conc)
    return {
      result: pH, label: 'pH', unit: '',
      steps: [
        { label: '[H⁺]', value: `${v.conc.toExponential(3)} M` },
        { label: 'pH = -log₁₀[H⁺] (complete dissociation)', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Strong acids completely dissociate in water, so [H⁺] equals the acid concentration. pH is calculated directly from the negative log of concentration.',
  formula: 'pH = -log₁₀[HA] (strong acid, complete dissociation)',
  interpretation: 'HCl, HNO₃, H₂SO₄ (first proton), and HBr are strong acids. A 0.01 M HCl solution has pH = 2.00. For very dilute acids (< 10⁻⁶ M), autoionization of water contributes.'
}

export default calcDef
