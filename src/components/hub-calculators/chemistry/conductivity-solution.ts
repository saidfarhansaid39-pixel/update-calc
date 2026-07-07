import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conductance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    cellConst: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conductance', label: 'Conductance (G)', type: 'number', unit: 'S', min: 1e-10, step: 'any' },
    { name: 'cellConst', label: 'Cell Constant (K_cell)', type: 'number', unit: 'cm⁻¹', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const kappa = v.conductance * v.cellConst
    return {
      result: kappa, label: 'Conductivity (κ)', unit: 'S/cm',
      steps: [
        { label: 'Measured conductance G', value: `${v.conductance.toExponential(4)} S` },
        { label: 'Cell constant K_cell', value: `${v.cellConst} cm⁻¹` },
        { label: 'κ = G × K_cell', value: `${kappa.toExponential(4)} S/cm` },
      ]
}
  },
  description: 'Solution conductivity (κ) measures the ability of an electrolyte solution to conduct electricity. It depends on ion concentration, mobility, and charge.',
  formula: 'κ = G × K_cell',
  interpretation: 'Conductivity increases with ion concentration and ion charge. Strong acids (HCl) have high conductivity. Deionized water has very low conductivity (≈ 0.05 μS/cm). Conductivity is temperature-dependent.'
}

export default calcDef
