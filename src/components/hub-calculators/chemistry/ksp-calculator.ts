import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cationConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    anionConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    cationCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1'),
    anionCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'cationConc', label: 'Cation Concentration', type: 'number', unit: 'M', min: 1e-20, step: 'any' },
    { name: 'anionConc', label: 'Anion Concentration', type: 'number', unit: 'M', min: 1e-20, step: 'any' },
    { name: 'cationCoeff', label: 'Cation Stoichiometric Coefficient', type: 'number', unit: '', min: 1, max: 5, step: '1' },
    { name: 'anionCoeff', label: 'Anion Stoichiometric Coefficient', type: 'number', unit: '', min: 1, max: 5, step: '1' },
  ],
  compute: (v) => {
    const ksp = Math.pow(v.cationConc, v.cationCoeff) * Math.pow(v.anionConc, v.anionCoeff)
    return {
      result: ksp, label: 'Solubility Product Ksp', unit: '',
      steps: [
        { label: '[Cation]^coeff', value: `${v.cationConc.toExponential(4)}^${v.cationCoeff}` },
        { label: '[Anion]^coeff', value: `${v.anionConc.toExponential(4)}^${v.anionCoeff}` },
        { label: 'Ksp = product', value: ksp.toExponential(6) },
      ]
}
  },
  description: 'The solubility product constant (Ksp) is the equilibrium constant for the dissolution of a sparingly soluble ionic compound in water.',
  formula: 'Ksp = [cation]^m × [anion]^n for AₘBₙ(s) ⇌ m Aⁿ⁺(aq) + n Bᵐ⁻(aq)',
  interpretation: 'For AgCl (Ksp = 1.8 × 10⁻¹⁰), the dissolution is AgCl(s) ⇌ Ag⁺ + Cl⁻, so Ksp = [Ag⁺][Cl⁻]. A smaller Ksp indicates lower solubility. Temperature affects Ksp values.'
}

export default calcDef
