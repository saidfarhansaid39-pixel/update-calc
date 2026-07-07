import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    M1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    V1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    V2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'M1', label: 'Initial Concentration (M₁)', type: 'number', unit: 'M', min: 0.0001, step: '0.01' },
    { name: 'V1', label: 'Initial Volume (V₁) of stock', type: 'number', unit: 'mL', min: 0.1, step: '1' },
    { name: 'V2', label: 'Final Total Volume (V₂)', type: 'number', unit: 'mL', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const M2 = v.M1 * v.V1 / v.V2
    const dilutionFactor = v.V2 / v.V1
    return {
      result: M2, label: 'Final Concentration (M₂)', unit: 'M',
      steps: [
        { label: 'M₁ (initial)', value: `${v.M1} M` },
        { label: 'V₁ (volume taken)', value: `${v.V1} mL` },
        { label: 'V₂ (total final volume)', value: `${v.V2} mL` },
        { label: 'M₂ = M₁·V₁/V₂', value: `${v.M1} × ${v.V1} / ${v.V2}` },
        { label: 'M₂', value: `${M2.toFixed(4)} M` },
        { label: 'Dilution factor', value: `${dilutionFactor.toFixed(2)}×` },
      ]
}
  },
  description: 'M₁V₁ = M₂V₂ is the dilution formula. It states that the number of moles of solute (M × V) remains constant during dilution. Only volume changes; moles are conserved.',
  formula: 'M₁V₁ = M₂V₂ | Dilution factor = V₂/V₁ | n = MV = constant',
  interpretation: 'Serial dilutions (10×, 100×, 1000×) are used to prepare standards for calibration curves. The dilution factor tells how many times more dilute the final solution is. Always ensure V₂ > V₁.'
}

export default calcDef
