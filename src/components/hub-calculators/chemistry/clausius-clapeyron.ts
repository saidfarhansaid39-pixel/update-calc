import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dHvap: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'p1', label: 'Vapor Pressure P₁ at T₁', type: 'number', unit: 'mmHg', min: 0.001, step: '0.001' },
    { name: 't1', label: 'Temperature T₁', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 't2', label: 'Temperature T₂', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 'dHvap', label: 'Enthalpy of Vaporization ΔHvap', type: 'number', unit: 'J/mol', min: 100, step: '100' },
  ],
  compute: (v) => {
    const R = 8.314
    const lnRatio = -(v.dHvap / R) * (1 / v.t2 - 1 / v.t1)
    const p2 = v.p1 * Math.exp(lnRatio)
    return {
      result: p2, label: 'Vapor Pressure P₂ at T₂', unit: 'mmHg',
      steps: [
        { label: 'P₁ at T₁', value: `${v.p1} mmHg @ ${v.t1} K` },
        { label: 'T₂', value: `${v.t2} K` },
        { label: 'ΔHvap', value: `${v.dHvap} J/mol` },
        { label: 'ln(P₂/P₁)', value: lnRatio.toFixed(4) },
        { label: 'P₂', value: `${p2.toFixed(2)} mmHg` },
        { label: 'Boils at T₂?', value: p2 >= 760 ? 'Yes (P ≥ 760 mmHg)' : 'No' },
      ]
}
  },
  description: 'The Clausius-Clapeyron equation relates vapor pressure to temperature, enabling calculation of vapor pressure at any temperature from known data.',
  formula: 'ln(P₂/P₁) = -ΔHvap/R × (1/T₂ - 1/T₁)',
  interpretation: 'Vapor pressure increases exponentially with temperature. Water boils at 100°C when vapor pressure reaches 760 mmHg. At higher altitudes (lower pressure), boiling point decreases.'
}

export default calcDef
