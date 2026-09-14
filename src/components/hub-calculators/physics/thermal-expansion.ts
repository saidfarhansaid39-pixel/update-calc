import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), coeff: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'volume', label: 'Original Volume', type: 'number', unit: 'm^3', min: 1e-6, step: '1e-6' }, { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' }, { name: 'coeff', label: 'Vol. Expansion Coeff.', type: 'number', unit: '/°C', min: 1e-7, step: '1e-7' }],
  defaults: { length: '10', tempChange: '20', coefficient: '1.2e-5' },
  presets: [
    { label: 'Steel rail (100 m, ΔT=30°C)', values: { length: '100', tempChange: '30', coefficient: '1.2e-5' } },
    { label: 'Aluminum wire (10 m, ΔT=50°C)', values: { length: '10', tempChange: '50', coefficient: '2.4e-5' } },
    { label: 'Concrete bridge (50 m, ΔT=40°C)', values: { length: '50', tempChange: '40', coefficient: '1e-5' } },
  ],
  compute: (v) => ({ result: v.volume * v.coeff * v.tempChange, label: 'Change in Volume', unit: 'm^3', steps: [{ label: 'Formula', value: 'ΔV = β·V0·ΔT' }, { label: 'β = 3α', value: `(linear coeff × 3 for isotropic)` }, { label: 'Result', value: `${(v.volume * v.coeff * v.tempChange).toExponential(4)} m^3` }],
      extras: [
        { label: 'Real-World Application', value: 'Thermal expansion requires expansion joints in bridges, railways, and pipelines. Eiffel Tower grows 15 cm taller in summer.' },
        { label: 'Common Values', value: 'Steel: α = 12×10⁻⁶ /°C. Aluminum: 24×10⁻⁶. Copper: 17×10⁻⁶. Concrete: 10×10⁻⁶. Glass: 8.5×10⁻⁶. Invar (low expansion): 1.2×10⁻⁶.' },
        { label: 'Precision Tip', value: 'Linear expansion: ΔL = αL₀ΔT. Area expansion: ΔA = 2αA₀ΔT. Volume expansion: ΔV = 3αV₀ΔT (for isotropic materials).' },
        { label: 'Related Formula', value: 'ΔL = αL₀ΔT. Bimetallic strip bending: radius = t/(α₁-α₂)ΔT. Thermal stress: σ = EαΔT (if constrained).' },
        { label: 'Unit Conversion Note', value: 'α in /°C or /K (same numeric value). Length in m. ΔT in °C or K. For °F: multiply α by 5/9.' }
      ] }),
  description: 'Volumetric thermal expansion: the change in volume of a material with temperature. β ≈ 3α for isotropic solids.',
  formula: 'ΔV = β·V0·ΔT',
  interpretation: 'β is the volumetric expansion coefficient, approximately 3 times the linear coefficient for isotropic materials. Liquids generally expand more than solids.'
}

export default calcDef
