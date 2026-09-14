import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ natural: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), driving: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'natural', label: 'Natural Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'driving', label: 'Driving Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Ratio', type: 'number', unit: '', min: 0, step: '0.01' }],
  defaults: { natural: '1', driving: '1', damping: '1' },
  presets: [
    { label: 'Standard example 1', values: { natural: '1', driving: '1', damping: '1' } },
    { label: 'Standard example 2', values: { natural: '10', driving: '10', damping: '10' } },
    { label: 'Standard example 3', values: { natural: '100', driving: '100', damping: '100' } },
  ],
  compute: (v) => { const num = 1; const denom = Math.sqrt(Math.pow(1 - (v.driving / v.natural) * (v.driving / v.natural), 2) + Math.pow(2 * v.damping * v.driving / v.natural, 2)); const amp = num / denom; return { result: amp, label: 'Amplitude Ratio', unit: '', steps: [{ label: 'Formula', value: 'A = F0/m / sqrt((ω0^2-ω^2)^2 + (2ζω0ω)^2)' }, { label: 'Driving/Natural', value: `${(v.driving / v.natural).toFixed(3)}` }, { label: 'Amplitude ratio', value: `${amp.toFixed(4)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Driven harmonic motion occurs when an external periodic force drives an oscillator. Resonance produces maximum amplitude when driving frequency matches natural frequency.',
  formula: 'A(ω) = F0/m / sqrt((ω0^2-ω^2)^2 + (2ζω0ω)^2)',
  interpretation: 'Resonance occurs near ω = ω0. Lower damping gives sharper, higher resonance peaks. Without damping, amplitude becomes infinite at resonance.'
}

export default calcDef
