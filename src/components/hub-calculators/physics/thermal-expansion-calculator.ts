import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), coeff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Original Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' }, { name: 'coeff', label: 'Expansion Coefficient', type: 'number', unit: '/°C', min: 1e-7, step: '1e-7' }],
  compute: (v) => ({ result: v.length * v.coeff * v.tempChange, label: 'Change in Length', unit: 'm', steps: [{ label: 'Formula', value: 'ΔL = α·L0·ΔT' }, { label: 'Substitute', value: `${v.coeff} × ${v.length} × ${v.tempChange}` }, { label: 'Result', value: `${(v.length * v.coeff * v.tempChange).toExponential(4)} m` }] }),
  description: 'Linear thermal expansion describes how a material\'s length changes with temperature.',
  formula: 'ΔL = α·L0·ΔT',
  interpretation: 'α is the coefficient of linear expansion. For steel α ≈ 1.2×10⁻⁵ /°C. Thermal expansion is critical in bridges and rails.'
}

export default calcDef
