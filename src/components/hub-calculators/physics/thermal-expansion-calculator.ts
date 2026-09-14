import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), coeff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Original Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' }, { name: 'coeff', label: 'Expansion Coefficient', type: 'number', unit: '/°C', min: 1e-7, step: '1e-7' }],
  defaults: { length: '10', tempChange: '20', coefficient: '1.2e-5' },
  presets: [
    { label: 'Steel rail (100 m, ΔT=30°C)', values: { length: '100', tempChange: '30', coefficient: '1.2e-5' } },
    { label: 'Aluminum wire (10 m, ΔT=50°C)', values: { length: '10', tempChange: '50', coefficient: '2.4e-5' } },
    { label: 'Concrete bridge (50 m, ΔT=40°C)', values: { length: '50', tempChange: '40', coefficient: '1e-5' } },
  ],
  compute: (v) => ({ result: v.length * v.coeff * v.tempChange, label: 'Change in Length', unit: 'm', steps: [{ label: 'Formula', value: 'ΔL = α·L0·ΔT' }, { label: 'Substitute', value: `${v.coeff} × ${v.length} × ${v.tempChange}` }, { label: 'Result', value: `${(v.length * v.coeff * v.tempChange).toExponential(4)} m` }],
      extras: [
        { label: 'Real-World Application', value: 'Thermal expansion requires expansion joints in bridges, railways, and pipelines. Eiffel Tower grows 15 cm taller in summer.' },
        { label: 'Common Values', value: 'Steel: α = 12×10⁻⁶ /°C. Aluminum: 24×10⁻⁶. Copper: 17×10⁻⁶. Concrete: 10×10⁻⁶. Glass: 8.5×10⁻⁶. Invar (low expansion): 1.2×10⁻⁶.' },
        { label: 'Precision Tip', value: 'Linear expansion: ΔL = αL₀ΔT. Area expansion: ΔA = 2αA₀ΔT. Volume expansion: ΔV = 3αV₀ΔT (for isotropic materials).' },
        { label: 'Related Formula', value: 'ΔL = αL₀ΔT. Bimetallic strip bending: radius = t/(α₁-α₂)ΔT. Thermal stress: σ = EαΔT (if constrained).' },
        { label: 'Unit Conversion Note', value: 'α in /°C or /K (same numeric value). Length in m. ΔT in °C or K. For °F: multiply α by 5/9.' }
      ] }),
  description: 'Linear thermal expansion describes how a material\'s length changes with temperature.',
  formula: 'ΔL = α·L0·ΔT',
  interpretation: 'α is the coefficient of linear expansion. For steel α ≈ 1.2×10⁻⁵ /°C. Thermal expansion is critical in bridges and rails.'
}

export default calcDef
