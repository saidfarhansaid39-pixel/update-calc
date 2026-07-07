import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ viscosity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'viscosity', label: 'Dynamic Viscosity η', type: 'number', unit: 'Pa·s', min: 1e-6, step: '1e-6' }, { name: 'radius', label: 'Sphere Radius r', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.001' }],
  compute: (v) => { const Fd = 6 * Math.PI * v.viscosity * v.radius * v.velocity; return { result: Fd, label: 'Drag Force', unit: 'N', steps: [{ label: 'Formula', value: 'F_d = 6πηrv (Stokes)' }, { label: 'Substitute', value: `6π × ${v.viscosity} × ${v.radius} × ${v.velocity}` }, { label: 'Result', value: `${Fd.toExponential(4)} N` }] } },
  description: 'Stokes\' Law gives the drag force on a sphere moving through a viscous fluid at low Reynolds numbers (laminar flow).',
  formula: 'F_d = 6π·η·r·v',
  interpretation: 'Valid only for Re < 1. Used to calculate sedimentation rate, terminal velocity of small particles, and the viscosity of fluids using falling-sphere viscometers. Stokes\' Law also describes the mobility of small organisms in water.'
}

export default calcDef
