import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 1, step: '1' }, { name: 'depth', label: 'Depth h', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  defaults: { diameter: '0.02', velocity: '2' },
  presets: [
    { label: 'Garden hose (2 cm diam, 2 m/s)', values: { diameter: '0.02', velocity: '2' } },
    { label: 'Water pipe (5 cm diam, 1.5 m/s)', values: { diameter: '0.05', velocity: '1.5' } },
    { label: 'IV drip (0.5 mm, 0.1 m/s)', values: { diameter: '0.0005', velocity: '0.1' } },
  ],
  compute: (v) => { const P = v.density * 9.81 * v.depth; return { result: P, label: 'Gauge Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: 'P = ρgh' }, { label: 'Substitute', value: `${v.density} × 9.81 × ${v.depth}` }, { label: 'Result', value: `${P.toFixed(1)} Pa (${(P / 101325).toFixed(3)} atm)` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Flow rate is critical for plumbing design, medical IVs, industrial piping, and river flow measurements.' },
        { label: 'Common Values', value: 'Garden hose: ~10-20 L/min. Shower head: ~8-15 L/min. Household main: ~15-20 L/min at 3 bar. Fire hose: ~500 L/min at 7 bar.' },
        { label: 'Precision Tip', value: 'Flow rate Q = A × v = πr² × v. Continuity: A₁v₁ = A₂v₂ (mass conservation). Real flow has viscosity (Poiseuille law for pipes).' },
        { label: 'Related Formula', value: 'Q = Av. Continuity: A₁v₁ = A₂v₂. Poiseuille: Q = πr⁴ΔP/(8ηL). Bernoulli: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂.' },
        { label: 'Unit Conversion Note', value: 'Q in m³/s. 1 m³/s = 1000 L/s = 60,000 L/min. 1 GPM = 0.063 L/s. 1 CFS = 28.32 L/s.' }
      ]} },
  description: 'Hydrostatic pressure increases linearly with depth in a fluid. P = ρgh, where h is depth below the surface.',
  formula: 'P = ρ·g·h',
  interpretation: 'Water pressure increases by 1 atm every ~10 m depth. At 1000 m depth in the ocean, pressure ≈ 100 atm. Absolute pressure = atmospheric + gauge pressure.'
}

export default calcDef
