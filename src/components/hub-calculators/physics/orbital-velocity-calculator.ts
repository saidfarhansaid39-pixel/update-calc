import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Central Mass', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'radius', label: 'Orbit Radius', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const G = 6.674e-11; const vo = Math.sqrt(G * v.mass / v.radius); return { result: vo, label: 'Orbital Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = sqrt(GM/r)' }, { label: 'G', value: '6.674×10⁻¹¹' }, { label: 'Result', value: `${vo.toFixed(1)} m/s (${(vo / 1000).toFixed(2)} km/s)` }] } },
  description: 'Orbital velocity is the speed needed to maintain a circular orbit around a celestial body.',
  formula: 'v = sqrt(GM/r)',
  interpretation: 'International Space Station orbits Earth at ~7.66 km/s. Higher orbits require lower orbital velocities.'
}

export default calcDef
