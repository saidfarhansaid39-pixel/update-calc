import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), coeff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'volume', label: 'Original Volume', type: 'number', unit: 'm^3', min: 1e-6, step: '1e-6' }, { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' }, { name: 'coeff', label: 'Vol. Expansion Coeff.', type: 'number', unit: '/°C', min: 1e-7, step: '1e-7' }],
  compute: (v) => ({ result: v.volume * v.coeff * v.tempChange, label: 'Change in Volume', unit: 'm^3', steps: [{ label: 'Formula', value: 'ΔV = β·V0·ΔT' }, { label: 'β = 3α', value: `(linear coeff × 3 for isotropic)` }, { label: 'Result', value: `${(v.volume * v.coeff * v.tempChange).toExponential(4)} m^3` }] }),
  description: 'Volumetric thermal expansion: the change in volume of a material with temperature. β ≈ 3α for isotropic solids.',
  formula: 'ΔV = β·V0·ΔT',
  interpretation: 'β is the volumetric expansion coefficient, approximately 3 times the linear coefficient for isotropic materials. Liquids generally expand more than solids.'
}

export default calcDef
