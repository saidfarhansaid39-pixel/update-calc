import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ turns: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 }, '≥1'), flux: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'turns', label: 'Number of Turns', type: 'number', unit: '', min: 1, step: '1' }, { name: 'flux', label: 'Magnetic Flux', type: 'number', unit: 'Wb', min: 1e-9, step: '1e-9' }, { name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  defaults: { turns: '100', length: '0.1', area: '0.0002' },
  presets: [
    { label: 'Solenoid (100 turns, 10 cm, 2 cm²)', values: { turns: '100', length: '0.1', area: '0.0002' } },
    { label: 'Toroidal inductor (500 turns, 5 cm radius, 1 cm²)', values: { turns: '500', radius: '0.05', area: '0.0001' } },
    { label: 'Air-core coil (50 turns, 2 cm, 1 cm²)', values: { turns: '50', length: '0.02', area: '0.0001' } },
  ],
  compute: (v) => { const L = v.turns * v.flux / v.current; return { result: L, label: 'Self-Inductance', unit: 'H', steps: [{ label: 'Formula', value: 'L = NΦ/I' }, { label: 'Result', value: `${L.toExponential(4)} H` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Inductors are used in power supplies (filters), transformers, radio tuning, and energy storage in switching converters.' },
        { label: 'Common Values', value: 'L = μ₀N²A/l (solenoid). μ₀ = 4π×10⁻⁷ H/m. Typical inductor: 1 μH - 10 H. Power supply filter: 10-100 mH. RF inductor: nH-μH.' },
        { label: 'Precision Tip', value: 'Inductance depends on geometry and core material. Ferrite cores increase L by factor μ_r (100-10,000). Energy: U = ½LI². Impedance: Z_L = jωL.' },
        { label: 'Related Formula', value: 'L = μ₀μ_r N²A/l. Mutual inductance: M = k√(L₁L₂). Energy: U = ½LI². Series: L_eq = L₁+L₂+...+2M (aiding). RL time constant: τ = L/R.' },
        { label: 'Unit Conversion Note', value: '1 H = 1 Wb/A = 1 V·s/A. 1 mH = 10⁻³ H. 1 μH = 10⁻⁶ H. 1 nH = 10⁻⁹ H. μ₀ = 4π×10⁻⁷ H/m.' }
      ]} },
  description: 'Self-inductance is the property of a coil that opposes changes in current. It stores energy in its magnetic field.',
  formula: 'L = N·Φ / I',
  interpretation: 'Inductance is measured in henries (H). An inductor stores energy as U = ½LI^2. Inductors resist current changes, smoothing current in circuits.'
}

export default calcDef
