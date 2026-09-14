import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dx: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'dx', label: 'Position Uncertainty Δx', type: 'number', unit: 'm', min: 1e-15, step: '1e-15' }],
  defaults: { positionUncertainty: '1e-10' },
  presets: [
    { label: 'Electron in atom (Δx=0.1 nm)', values: { positionUncertainty: '1e-10' } },
    { label: 'Electron in nucleus (Δx=1 fm)', values: { positionUncertainty: '1e-15' } },
    { label: 'Macroscopic (Δx=1 μm)', values: { positionUncertainty: '1e-6' } },
  ],
  compute: (v) => { const hbar = 1.055e-34; const dp_min = hbar / (2 * v.dx); return { result: dp_min, label: 'Minimum Momentum Uncertainty Δp', unit: 'kg·m/s', steps: [{ label: 'Formula', value: 'Δx·Δp ≥ ħ/2' }, { label: 'ħ', value: '1.055×10^-34 J·s' }, { label: 'Δp_min', value: `${dp_min.toExponential(4)} kg·m/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Heisenberg\'s uncertainty principle sets fundamental limits on measurement. Electron in an atom (Δx~0.1 nm): Δv ~ 5.8×10⁵ m/s.' },
        { label: 'Common Values', value: 'ħ = 1.055×10⁻³⁴ J·s. Δx·Δp ≥ ħ/2. Δx·Δv ≥ ħ/(2m). For m_e: Δx=1 nm → Δv ≥ 5.8×10⁴ m/s. For m=1 g: Δx=1 μm → Δv ≥ 5.3×10⁻²⁶ m/s.' },
        { label: 'Precision Tip', value: 'The uncertainty principle is not about measurement error — it\'s a fundamental property of quantum systems. A particle cannot simultaneously have precise position and momentum.' },
        { label: 'Related Formula', value: 'Δx·Δp ≥ ħ/2. Also: ΔE·Δt ≥ ħ/2 (energy-time uncertainty). John Bell: √(Δx²Δp²) ≥ ħ/2 (Robertson-Schrödinger).' },
        { label: 'Unit Conversion Note', value: 'ħ = h/2π = 1.055×10⁻³⁴ J·s. Δx in m. Δp = mΔv in kg·m/s. Result in m/s for Δv. Convert to J·s via h or ħ.' }
      ]} },
  description: 'Heisenberg\'s uncertainty principle states a fundamental limit to the precision with which complementary variables (position and momentum) can be known simultaneously.',
  formula: 'Δx·Δp ≥ ħ/2',
  interpretation: 'This is a fundamental law of quantum mechanics, not a measurement limitation. ħ = h/2π = 1.055×10^-34 J·s. If position is known precisely, momentum is inherently uncertain and vice versa.'
}

export default calcDef
