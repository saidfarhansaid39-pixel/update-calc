import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), shape: z.string().min(1) }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'radius', label: 'Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'shape', label: 'Shape', type: 'select', options: [{ label: 'Solid cylinder/disk', value: '0.5' }, { label: 'Solid sphere', value: '0.4' }, { label: 'Thin hoop', value: '1' }, { label: 'Thin rod (center)', value: '0.08333' }] }],
  compute: (v) => { const I = parseFloat(v.shape) * v.mass * v.radius * v.radius; return { result: I, label: 'Moment of Inertia', unit: 'kg·m^2', steps: [{ label: 'Formula', value: 'I = k·m·r^2' }, { label: 'Shape factor k', value: v.shape }, { label: 'Result', value: `${I.toFixed(4)} kg·m^2` }] } },
  description: 'Moment of inertia quantifies rotational inertia—resistance to angular acceleration about an axis.',
  formula: 'I = k·m·r^2',
  interpretation: 'The shape factor k depends on mass distribution: solid sphere (2/5), solid cylinder (1/2), thin hoop (1), thin rod about center (1/12).'
}

export default calcDef
