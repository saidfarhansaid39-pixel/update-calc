import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ksp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    commonIon: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'ksp', label: 'Ksp', type: 'number', unit: '', min: 1e-50, step: 'any' },
    { name: 'commonIon', label: 'Concentration of Common Ion', type: 'number', unit: 'M', min: 0, step: '0.001' },
  ],
  compute: (v) => {
    const s = v.ksp / (v.commonIon + Math.sqrt(v.commonIon * v.commonIon + 4 * v.ksp)) * 2
    const sSimple = v.commonIon > 0 ? v.ksp / v.commonIon : Math.sqrt(v.ksp)
    const reduction = v.commonIon > 0 ? (1 - s / sSimple) * 100 : 0
    return {
      result: s, label: 'Molar Solubility (with common ion)', unit: 'M',
      steps: [
        { label: 'Ksp', value: `${v.ksp.toExponential(4)}` },
        { label: '[Common ion]', value: `${v.commonIon} M` },
        { label: 'Solubility with common ion', value: `${s.toExponential(6)} M` },
        { label: 'Reduction in solubility', value: `${reduction.toFixed(1)}%` },
      ]
}
  },
  description: 'The common ion effect describes the reduction in solubility of a salt when a solution already contains one of its constituent ions (Le Chatelier\'s principle applied to solubility equilibria).',
  formula: 'For MA(s) ⇌ M⁺(aq) + A⁻(aq): s = Ksp / [common ion] (approximate)',
  interpretation: 'Adding a common ion shifts the equilibrium toward the solid, reducing solubility. For example, adding NaCl to a saturated AgCl solution reduces [Ag⁺] from 1.3 × 10⁻⁵ M to much less.'
}

export default calcDef
