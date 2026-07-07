import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ksp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    coeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'ksp', label: 'Ksp', type: 'number', unit: '', min: 1e-50, step: 'any' },
    { name: 'coeff', label: 'Total Ions per Formula Unit', type: 'number', unit: '', min: 1, max: 5, step: '1' },
  ],
  compute: (v) => {
    const s = Math.pow(v.ksp / Math.pow(v.coeff, v.coeff), 1 / (v.coeff + 1))
    return {
      result: s, label: 'Molar Solubility', unit: 'M',
      steps: [
        { label: 'Ksp', value: `${v.ksp.toExponential(4)}` },
        { label: 'Total ions per formula', value: `${v.coeff}` },
        { label: 's = (Ksp / c^c)^(1/(c+1))', value: `${s.toExponential(6)} M` },
      ]
}
  },
  description: 'Molar solubility (S) is the number of moles of a sparingly soluble compound that dissolve per liter of solution. It is calculated from the solubility product constant (Ksp).',
  formula: 'For MA: S = √Ksp. For MA₂: S = ∛(Ksp/4). General: S = (Ksp / (m^m × n^n))^(1/(m+n))',
  interpretation: 'For AgCl (Ksp = 1.8 × 10⁻¹⁰), S = √(1.8 × 10⁻¹⁰) = 1.34 × 10⁻⁵ M. For PbCl₂ (Ksp = 1.6 × 10⁻⁵), S = ∛(Ksp/4) = 1.6 × 10⁻² M.'
}

export default calcDef
