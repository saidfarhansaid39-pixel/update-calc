import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ natural: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), driving: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'natural', label: 'Natural Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'driving', label: 'Driving Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Ratio', type: 'number', unit: '', min: 0, step: '0.01' }],
  compute: (v) => { const num = 1; const denom = Math.sqrt(Math.pow(1 - (v.driving / v.natural) * (v.driving / v.natural), 2) + Math.pow(2 * v.damping * v.driving / v.natural, 2)); const amp = num / denom; return { result: amp, label: 'Amplitude Ratio', unit: '', steps: [{ label: 'Formula', value: 'A = F0/m / sqrt((ω0^2-ω^2)^2 + (2ζω0ω)^2)' }, { label: 'Driving/Natural', value: `${(v.driving / v.natural).toFixed(3)}` }, { label: 'Amplitude ratio', value: `${amp.toFixed(4)}` }] } },
  description: 'Driven harmonic motion occurs when an external periodic force drives an oscillator. Resonance produces maximum amplitude when driving frequency matches natural frequency.',
  formula: 'A(ω) = F0/m / sqrt((ω0^2-ω^2)^2 + (2ζω0ω)^2)',
  interpretation: 'Resonance occurs near ω = ω0. Lower damping gives sharper, higher resonance peaks. Without damping, amplitude becomes infinite at resonance.'
}

export default calcDef
