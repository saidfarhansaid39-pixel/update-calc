import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inertia: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'inertia', label: 'Moment of Inertia', type: 'number', unit: 'kg·m^2', min: 0.001, step: '0.001' }, { name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Pivot to COM Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.inertia / (v.mass * 9.81 * v.distance)); return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(I/mgd)' }, { label: 'Substitute', value: `2pisqrt(${v.inertia}/(${v.mass}×9.81×${v.distance}))` }, { label: 'Result', value: `${T.toFixed(4)} s` }] } },
  description: 'A physical pendulum is any rigid body pivoted about a point that oscillates under gravity. Its period depends on the moment of inertia.',
  formula: 'T = 2pisqrt(I / mgd)',
  interpretation: 'The period depends on the distribution of mass, not just the center of mass position. A longer equivalent length gives a longer period.'
}

export default calcDef
