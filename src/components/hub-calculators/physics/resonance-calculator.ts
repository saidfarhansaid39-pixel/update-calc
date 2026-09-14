import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ natural: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), damping: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'natural', label: 'Natural Frequency', type: 'number', unit: 'rad/s', min: 0.01, step: '0.01' }, { name: 'damping', label: 'Damping Ratio', type: 'number', unit: '', min: 0, step: '0.01' }],
  defaults: { natural: '1', damping: '1' },
  presets: [
    { label: 'Standard example 1', values: { natural: '1', damping: '1' } },
    { label: 'Standard example 2', values: { natural: '10', damping: '10' } },
    { label: 'Standard example 3', values: { natural: '100', damping: '100' } },
  ],
  compute: (v) => { const omegaR = v.natural * Math.sqrt(1 - 2 * v.damping * v.damping); const Q = 1 / (2 * v.damping); return { result: omegaR, label: 'Resonance Frequency', unit: 'rad/s', steps: [{ label: 'Formula', value: 'ωᵣ = ω0sqrt(1-2ζ^2)' }, { label: 'Natural ω0', value: `${v.natural} rad/s` }, { label: 'Resonance ωᵣ', value: `${omegaR.toFixed(3)} rad/s` }, { label: 'Quality factor', value: `Q = ${Q.toFixed(2)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Resonance occurs when a driving frequency matches the natural frequency, producing maximum amplitude.',
  formula: 'ωᵣ = ω0sqrt(1 - 2ζ^2), Q = 1/(2ζ)',
  interpretation: 'Resonance amplifies oscillations at specific frequencies. High Q means sharp resonance. Damping reduces peak amplitude and broadens the resonance curve.'
}

export default calcDef
