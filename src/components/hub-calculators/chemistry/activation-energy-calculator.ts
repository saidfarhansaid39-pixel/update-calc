import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    k2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'k1', label: 'Rate Constant k₁', type: 'number', unit: 's⁻¹', min: 0.0001, step: 'any' },
    { name: 't1', label: 'Temperature T₁', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 'k2', label: 'Rate Constant k₂', type: 'number', unit: 's⁻¹', min: 0.0001, step: 'any' },
    { name: 't2', label: 'Temperature T₂', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 8.314
    const lnRatio = Math.log(v.k2 / v.k1)
    const invTemp = 1 / v.t1 - 1 / v.t2
    const Ea = -R * lnRatio / invTemp
    return {
      result: Ea, label: 'Activation Energy', unit: 'J/mol',
      steps: [
        { label: 'k₁', value: `${v.k1.toExponential(4)} s⁻¹` },
        { label: 'k₂', value: `${v.k2.toExponential(4)} s⁻¹` },
        { label: 'T₁', value: `${v.t1} K` },
        { label: 'T₂', value: `${v.t2} K` },
        { label: 'Ea', value: `${Ea.toFixed(1)} J/mol (${(Ea / 1000).toFixed(3)} kJ/mol)` },
      ]
}
  },
  description: 'Activation energy (Ea) is the minimum energy required for a chemical reaction to occur. It is calculated using the Arrhenius equation from rate constants at two temperatures.',
  formula: 'ln(k₂/k₁) = -Ea/R × (1/T₂ - 1/T₁)',
  interpretation: 'Lower activation energy means faster reactions. Typical values range from 20-200 kJ/mol. Catalysts lower Ea without being consumed.'
}

export default calcDef
