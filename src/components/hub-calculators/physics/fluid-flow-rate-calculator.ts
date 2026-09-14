import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'area', label: 'Cross-Sectional Area', type: 'number', unit: 'm^2', min: 0.0001, step: '0.0001' }, { name: 'velocity', label: 'Flow Velocity', type: 'number', unit: 'm/s', min: 0.01, step: '0.01' }],
  defaults: { diameter: '0.02', velocity: '2' },
  presets: [
    { label: 'Garden hose (2 cm diam, 2 m/s)', values: { diameter: '0.02', velocity: '2' } },
    { label: 'Water pipe (5 cm diam, 1.5 m/s)', values: { diameter: '0.05', velocity: '1.5' } },
    { label: 'IV drip (0.5 mm, 0.1 m/s)', values: { diameter: '0.0005', velocity: '0.1' } },
  ],
  compute: (v) => ({ result: v.area * v.velocity, label: 'Volumetric Flow Rate', unit: 'm^3/s', steps: [{ label: 'Formula', value: 'Q = Av' }, { label: 'Substitute', value: `${v.area} × ${v.velocity}` }, { label: 'Result', value: `${(v.area * v.velocity).toFixed(6)} m^3/s` }],
      extras: [
        { label: 'Real-World Application', value: 'Flow rate is critical for plumbing design, medical IVs, industrial piping, and river flow measurements.' },
        { label: 'Common Values', value: 'Garden hose: ~10-20 L/min. Shower head: ~8-15 L/min. Household main: ~15-20 L/min at 3 bar. Fire hose: ~500 L/min at 7 bar.' },
        { label: 'Precision Tip', value: 'Flow rate Q = A × v = πr² × v. Continuity: A₁v₁ = A₂v₂ (mass conservation). Real flow has viscosity (Poiseuille law for pipes).' },
        { label: 'Related Formula', value: 'Q = Av. Continuity: A₁v₁ = A₂v₂. Poiseuille: Q = πr⁴ΔP/(8ηL). Bernoulli: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂.' },
        { label: 'Unit Conversion Note', value: 'Q in m³/s. 1 m³/s = 1000 L/s = 60,000 L/min. 1 GPM = 0.063 L/s. 1 CFS = 28.32 L/s.' }
      ] }),
  description: 'Volumetric flow rate is the volume of fluid passing through a cross-section per unit time.',
  formula: 'Q = A × v',
  interpretation: 'Flow rate is conserved in incompressible flow (continuity equation). Constricted pipes increase velocity to maintain Q.'
}

export default calcDef
