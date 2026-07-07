import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Central Mass M', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'radius', label: 'Orbit Radius r', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const G = 6.674e-11; const v_orb = Math.sqrt(G * v.mass / v.radius); return { result: v_orb, label: 'Orbital Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = √(GM/r)' }, { label: 'G', value: '6.674×10⁻¹¹' }, { label: 'Result', value: `${v_orb.toFixed(1)} m/s (${(v_orb / 1000).toFixed(2)} km/s)` }] } },
  description: 'Orbital velocity is the speed needed to maintain a circular orbit around a celestial body. It decreases with orbital radius.',
  formula: 'v = √(GM/r)',
  interpretation: 'ISS orbits at ~7.66 km/s at r ≈ 6770 km. Geostationary orbit at r ≈ 42,164 km requires v ≈ 3.07 km/s. Higher orbits = slower orbital speed.'
}

export default calcDef
