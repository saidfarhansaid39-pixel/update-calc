import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const G = 6.674e-11

const planets: { label: string; mass: string; radius: string }[] = [
  { label: 'Mercury', mass: '3.3011e23', radius: '2.4397e6' },
  { label: 'Venus', mass: '4.8675e24', radius: '6.0518e6' },
  { label: 'Earth', mass: '5.9722e24', radius: '6.371e6' },
  { label: 'Moon', mass: '7.342e22', radius: '1.7374e6' },
  { label: 'Mars', mass: '6.4171e23', radius: '3.3895e6' },
  { label: 'Jupiter', mass: '1.8982e27', radius: '6.9911e7' },
  { label: 'Saturn', mass: '5.6834e26', radius: '5.8232e7' },
  { label: 'Uranus', mass: '8.681e25', radius: '2.5362e7' },
  { label: 'Neptune', mass: '1.0241e26', radius: '2.4622e7' },
  { label: 'Sun', mass: '1.9885e30', radius: '6.957e8' },
]

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mass', label: 'Planet Mass', type: 'number', unit: 'kg', min: 1e15, step: '1e20' },
    { name: 'radius', label: 'Planet Radius', type: 'number', unit: 'm', min: 1e3, step: '1e6' },
  ],
  presets: planets.map(p => ({ label: p.label, values: { mass: p.mass, radius: p.radius } })),
  defaults: { mass: '5.9722e24', radius: '6.371e6' },
  compute: (v) => {
    const ve = Math.sqrt(2 * G * v.mass / v.radius)
    const firstCosmic = Math.sqrt(G * v.mass / v.radius)
    const km_s = ve / 1000
    const findPlanet = planets.find(p => p.mass === String(v.mass) && p.radius === String(v.radius))
    return {
      result: ve, label: 'Escape Velocity', unit: 'm/s',
      steps: [
        { label: 'Formula', value: 'vₑ = sqrt(2GM/r)' },
        { label: 'G', value: '6.674×10⁻¹¹ m^3/kg·s^2' },
        { label: 'Mass M', value: `${Number(v.mass).toExponential(3)} kg` },
        { label: 'Radius r', value: `${(Number(v.radius) / 1000).toFixed(0)} km` },
        { label: 'Escape velocity', value: `${ve.toFixed(1)} m/s (${km_s.toFixed(2)} km/s)` },
        { label: 'First cosmic velocity', value: `${firstCosmic.toFixed(1)} m/s (${(firstCosmic / 1000).toFixed(2)} km/s)` },
      ],
      extras: [
        { label: 'km/s', value: km_s.toFixed(2) },
        { label: 'mph', value: (ve * 2.23694).toFixed(0) },
        { label: 'First cosmic (orbital) velocity', value: firstCosmic.toFixed(1) + ' m/s' },
        { label: 'Orbital velocity (km/s)', value: (firstCosmic / 1000).toFixed(2) },
        { label: 'Body', value: findPlanet?.label || 'Custom' },
        { label: 'Earth escape velocities', value: '11.2 km/s (surface), 1.4 km/s at Moon orbit' },
      ]
    }
  },
  description: 'Escape velocity is the minimum speed required for an object to escape a planet\'s gravitational field without further propulsion.',
  formula: 'vₑ = sqrt(2GM/r) | First cosmic: vₒ = sqrt(GM/r)',
  interpretation: 'Earth\'s escape velocity is ~11.2 km/s (25,000 mph). Black holes have escape velocity exceeding the speed of light. The first cosmic velocity (orbital velocity) is vₑ/√2.'
}

export default calcDef
