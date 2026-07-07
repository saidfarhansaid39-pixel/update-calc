import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ natural: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'natural', label: 'Natural Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Ratio', type: 'number', unit: '', min: 0, step: '0.01' }],
  compute: (v) => { const omegaR = v.natural * Math.sqrt(1 - 2 * v.damping * v.damping); const Q = 1 / (2 * v.damping); return { result: omegaR, label: 'Resonance Frequency', unit: 'rad/s', steps: [{ label: 'Formula', value: 'ωᵣ = ω0sqrt(1-2ζ^2)' }, { label: 'Natural ω0', value: `${v.natural} rad/s` }, { label: 'Resonance ωᵣ', value: `${omegaR.toFixed(3)} rad/s` }, { label: 'Quality factor', value: `Q = ${Q.toFixed(2)}` }] } },
  description: 'Resonance occurs when a driving frequency matches the natural frequency, producing maximum amplitude.',
  formula: 'ωᵣ = ω0sqrt(1 - 2ζ^2), Q = 1/(2ζ)',
  interpretation: 'Resonance amplifies oscillations at specific frequencies. High Q means sharp resonance. Damping reduces peak amplitude and broadens the resonance curve.'
}

export default calcDef
