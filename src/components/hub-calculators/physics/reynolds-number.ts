import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), viscosity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Flow Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'length', label: 'Characteristic Length L', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'viscosity', label: 'Dynamic Viscosity μ', type: 'number', unit: 'Pa·s', min: 1e-6, step: '1e-6' }],
  compute: (v) => { const Re = v.density * v.velocity * v.length / v.viscosity; const regime = Re < 2000 ? 'Laminar' : Re < 4000 ? 'Transitional' : 'Turbulent'; return { result: Re, label: 'Reynolds Number', unit: '', steps: [{ label: 'Formula', value: 'Re = ρvL/μ' }, { label: 'Result', value: `${Re.toFixed(1)}` }, { label: 'Flow regime', value: regime }] } },
  description: 'The Reynolds number is the ratio of inertial forces to viscous forces in fluid flow. It determines whether flow is laminar or turbulent.',
  formula: 'Re = ρ·v·L / μ',
  interpretation: 'Re < 2000: laminar (smooth, predictable). Re > 4000: turbulent (chaotic, eddies). Pipe flow transition occurs around Re ≈ 2300. Turbulent flow increases drag and mixing.'
}

export default calcDef
