import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Length', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  defaults: { length: '1', gravity: '9.81' },
  presets: [
    { label: '1 m pendulum (T ≈ 2 s)', values: { length: '1', gravity: '9.81' } },
    { label: 'Foucault pendulum (67 m)', values: { length: '67', gravity: '9.81' } },
    { label: 'Grandfather clock (0.25 m)', values: { length: '0.25', gravity: '9.81' } },
  ],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.length / 9.81); const f = 1 / T; return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(L/g)' }, { label: 'g', value: '9.81 m/s^2' }, { label: 'Result', value: `${T.toFixed(4)} s` }, { label: 'Frequency', value: `${f.toFixed(4)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Pendulums regulate clocks, measure gravity, and demonstrate Earth\'s rotation (Foucault pendulum). The 1 m pendulum has a period of ~2 seconds.' },
        { label: 'Common Values', value: 'g = 9.81 m/s² (Earth). g_Moon = 1.62 m/s². g_Mars = 3.71 m/s². 1 m pendulum on Earth: T = 2.01 s.' },
        { label: 'Precision Tip', value: 'Formula T = 2π√(L/g) is accurate for small angles (<15°). For larger angles, use the complete elliptic integral of the first kind.' },
        { label: 'Related Formula', value: 'Simple pendulum: T = 2π√(L/g). Physical pendulum: T = 2π√(I/mgd). Torsion pendulum: T = 2π√(I/κ).' },
        { label: 'Unit Conversion Note', value: 'Length in m. g in m/s². Period in s. Frequency f = 1/T in Hz. Angular frequency ω = 2π/T = √(g/L).' }
      ]} },
  description: 'A simple pendulum\'s period depends only on its length and gravitational acceleration, not on mass or amplitude (for small angles).',
  formula: 'T = 2pisqrt(L/g)',
  interpretation: 'A 1 m pendulum has a period of ~2.01 s. Pendulum motion is approximately simple harmonic for small angles (<15°).'
}

export default calcDef
