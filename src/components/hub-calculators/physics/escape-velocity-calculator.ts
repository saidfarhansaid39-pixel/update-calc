import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Planet Mass', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'radius', label: 'Planet Radius', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const G = 6.674e-11; const ve = Math.sqrt(2 * G * v.mass / v.radius); return { result: ve, label: 'Escape Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'vₑ = sqrt(2GM/r)' }, { label: 'G', value: '6.674×10⁻¹¹ m^3/kg·s^2' }, { label: 'Result', value: `${ve.toFixed(1)} m/s (${(ve / 1000).toFixed(2)} km/s)` }] } },
  description: 'Escape velocity is the minimum speed required for an object to escape a planet\'s gravitational field without further propulsion.',
  formula: 'vₑ = sqrt(2GM/r)',
  interpretation: 'Earth\'s escape velocity is ~11.2 km/s. Black holes have escape velocity exceeding the speed of light.'
}

export default calcDef
