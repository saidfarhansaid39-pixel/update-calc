import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    k1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    k2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'k1', label: 'Rate Constant k₁ at T₁', type: 'number', unit: 's⁻¹', min: 1e-10, step: 'any' },
    { name: 't1', label: 'Temperature T₁', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 'k2', label: 'Rate Constant k₂ at T₂', type: 'number', unit: 's⁻¹', min: 1e-10, step: 'any' },
    { name: 't2', label: 'Temperature T₂', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 8.314
    const lnRatio = Math.log(v.k2 / v.k1)
    const invTemp = 1 / v.t1 - 1 / v.t2
    const ea = -R * lnRatio / invTemp
    return {
      result: ea, label: 'Activation Energy Ea', unit: 'J/mol',
      steps: [
        { label: 'k₁ at T₁', value: `${v.k1.toExponential(4)} s⁻¹ @ ${v.t1} K` },
        { label: 'k₂ at T₂', value: `${v.k2.toExponential(4)} s⁻¹ @ ${v.t2} K` },
        { label: 'ln(k₂/k₁)', value: lnRatio.toFixed(4) },
        { label: '1/T₁ - 1/T₂', value: invTemp.toExponential(4) },
        { label: 'Ea = -R·ln(k₂/k₁)/(1/T₁ - 1/T₂)', value: `${ea.toFixed(1)} J/mol (${(ea / 1000).toFixed(2)} kJ/mol)` },
      ]
}
  },
  description: 'Activation energy is calculated from the Arrhenius equation using rate constants at two different temperatures. Ea is the minimum energy required for a reaction to occur.',
  formula: 'ln(k₂/k₁) = -Ea/R × (1/T₂ - 1/T₁)',
  interpretation: 'Typical Ea values: 20-200 kJ/mol. Reactions with Ea < 40 kJ/mol are very fast at room temperature. Ea > 120 kJ/mol require heating to proceed at reasonable rates.'
}

export default calcDef
