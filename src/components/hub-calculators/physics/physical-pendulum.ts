import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inertia: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'inertia', label: 'Moment of Inertia', type: 'number', unit: 'kg·m^2', min: 0.001, step: '0.001' }, { name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Pivot to COM Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { length: '1', gravity: '9.81' },
  presets: [
    { label: '1 m pendulum (T ≈ 2 s)', values: { length: '1', gravity: '9.81' } },
    { label: 'Foucault pendulum (67 m)', values: { length: '67', gravity: '9.81' } },
    { label: 'Grandfather clock (0.25 m)', values: { length: '0.25', gravity: '9.81' } },
  ],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.inertia / (v.mass * 9.81 * v.distance)); return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(I/mgd)' }, { label: 'Substitute', value: `2pisqrt(${v.inertia}/(${v.mass}×9.81×${v.distance}))` }, { label: 'Result', value: `${T.toFixed(4)} s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Pendulums regulate clocks, measure gravity, and demonstrate Earth\'s rotation (Foucault pendulum). The 1 m pendulum has a period of ~2 seconds.' },
        { label: 'Common Values', value: 'g = 9.81 m/s² (Earth). g_Moon = 1.62 m/s². g_Mars = 3.71 m/s². 1 m pendulum on Earth: T = 2.01 s.' },
        { label: 'Precision Tip', value: 'Formula T = 2π√(L/g) is accurate for small angles (<15°). For larger angles, use the complete elliptic integral of the first kind.' },
        { label: 'Related Formula', value: 'Simple pendulum: T = 2π√(L/g). Physical pendulum: T = 2π√(I/mgd). Torsion pendulum: T = 2π√(I/κ).' },
        { label: 'Unit Conversion Note', value: 'Length in m. g in m/s². Period in s. Frequency f = 1/T in Hz. Angular frequency ω = 2π/T = √(g/L).' }
      ]} },
  description: 'A physical pendulum is any rigid body pivoted about a point that oscillates under gravity. Its period depends on the moment of inertia.',
  formula: 'T = 2pisqrt(I / mgd)',
  interpretation: 'The period depends on the distribution of mass, not just the center of mass position. A longer equivalent length gives a longer period.'
}

export default calcDef
