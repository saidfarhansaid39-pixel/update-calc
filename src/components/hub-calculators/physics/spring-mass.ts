import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  defaults: { mass: '1', springConstant: '100' },
  presets: [
    { label: 'Car suspension (m=300 kg, k=20000)', values: { mass: '300', springConstant: '20000' } },
    { label: 'Pogo stick (m=70 kg, k=5000)', values: { mass: '70', springConstant: '5000' } },
    { label: 'Lab spring (m=0.5 kg, k=100)', values: { mass: '0.5', springConstant: '100' } },
  ],
  compute: (v) => { const omega = Math.sqrt(v.springConstant / v.mass); const T = 2 * Math.PI / omega; const f = 1 / T; return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(m/k)' }, { label: 'Angular frequency ω', value: `${omega.toFixed(3)} rad/s` }, { label: 'Period', value: `${T.toFixed(4)} s` }, { label: 'Frequency', value: `${f.toFixed(3)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Spring-mass systems model vehicle suspensions, building oscillations, and mechanical vibrations. Natural frequency determines resonance behavior.' },
        { label: 'Common Values', value: 'T = 2π√(m/k). Mass on k=100 N/m spring: m=1 kg → T=0.628 s, f=1.59 Hz. Car on springs: ~1-2 Hz. Building: ~0.1-0.5 Hz.' },
        { label: 'Precision Tip', value: 'Simple harmonic oscillator: ω = √(k/m). Period independent of amplitude (small oscillations). Damping reduces frequency slightly.' },
        { label: 'Related Formula', value: 'T = 2π√(m/k). f = 1/(2π)√(k/m). Energy: E = ½kA² = ½mv²_max. Damped: ω\' = √(k/m - b²/4m²).' },
        { label: 'Unit Conversion Note', value: 'm in kg. k in N/m. T in s. f in Hz. ω in rad/s. Converting: f = ω/2π, T = 2π/ω = 1/f.' }
      ]} },
  description: 'A spring-mass system exhibits simple harmonic motion. The period depends only on mass and spring constant.',
  formula: 'T = 2pisqrt(m/k)',
  interpretation: 'The period is independent of amplitude for ideal springs. A stiffer spring (larger k) produces a shorter period.'
}

export default calcDef
