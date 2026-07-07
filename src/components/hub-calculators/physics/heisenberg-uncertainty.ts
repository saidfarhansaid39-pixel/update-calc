import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dx: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'dx', label: 'Position Uncertainty Δx', type: 'number', unit: 'm', min: 1e-15, step: '1e-15' }],
  compute: (v) => { const hbar = 1.055e-34; const dp_min = hbar / (2 * v.dx); return { result: dp_min, label: 'Minimum Momentum Uncertainty Δp', unit: 'kg·m/s', steps: [{ label: 'Formula', value: 'Δx·Δp ≥ ħ/2' }, { label: 'ħ', value: '1.055×10^-34 J·s' }, { label: 'Δp_min', value: `${dp_min.toExponential(4)} kg·m/s` }] } },
  description: 'Heisenberg\'s uncertainty principle states a fundamental limit to the precision with which complementary variables (position and momentum) can be known simultaneously.',
  formula: 'Δx·Δp ≥ ħ/2',
  interpretation: 'This is a fundamental law of quantum mechanics, not a measurement limitation. ħ = h/2π = 1.055×10^-34 J·s. If position is known precisely, momentum is inherently uncertain and vice versa.'
}

export default calcDef
