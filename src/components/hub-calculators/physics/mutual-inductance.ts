import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns2: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), flux2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns2', label: 'Secondary Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'flux2', label: 'Flux Through Secondary', type: 'number', unit: 'Wb', min: 1e-9, step: '1e-9' }, { name: 'current1', label: 'Primary Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  defaults: { turns: '100', length: '0.1', area: '0.0002' },
  presets: [
    { label: 'Solenoid (100 turns, 10 cm, 2 cm²)', values: { turns: '100', length: '0.1', area: '0.0002' } },
    { label: 'Toroidal inductor (500 turns, 5 cm radius, 1 cm²)', values: { turns: '500', radius: '0.05', area: '0.0001' } },
    { label: 'Air-core coil (50 turns, 2 cm, 1 cm²)', values: { turns: '50', length: '0.02', area: '0.0001' } },
  ],
  compute: (v) => { const M = v.turns2 * v.flux2 / v.current1; return { result: M, label: 'Mutual Inductance', unit: 'H', steps: [{ label: 'Formula', value: 'M = N₂Φ₂/I₁' }, { label: 'Result', value: `${M.toExponential(4)} H` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Inductors are used in power supplies (filters), transformers, radio tuning, and energy storage in switching converters.' },
        { label: 'Common Values', value: 'L = μ₀N²A/l (solenoid). μ₀ = 4π×10⁻⁷ H/m. Typical inductor: 1 μH - 10 H. Power supply filter: 10-100 mH. RF inductor: nH-μH.' },
        { label: 'Precision Tip', value: 'Inductance depends on geometry and core material. Ferrite cores increase L by factor μ_r (100-10,000). Energy: U = ½LI². Impedance: Z_L = jωL.' },
        { label: 'Related Formula', value: 'L = μ₀μ_r N²A/l. Mutual inductance: M = k√(L₁L₂). Energy: U = ½LI². Series: L_eq = L₁+L₂+...+2M (aiding). RL time constant: τ = L/R.' },
        { label: 'Unit Conversion Note', value: '1 H = 1 Wb/A = 1 V·s/A. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 nH = 10⁻⁹ H. μ₀ = 4π×10⁻⁷ H/m.' }
      ]} },
  description: 'Mutual inductance quantifies the magnetic coupling between two coils. It determines the induced EMF in one coil due to changing current in the other.',
  formula: 'M = N₂·Φ₂ / I₁',
  interpretation: 'Mutual inductance is the basis of transformer operation. The coupling coefficient k = M/√(L₁L₂) ranges from 0 (no coupling) to 1 (perfect coupling).'
}

export default calcDef
