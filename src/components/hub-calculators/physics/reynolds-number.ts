import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), viscosity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Flow Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'length', label: 'Characteristic Length L', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'viscosity', label: 'Dynamic Viscosity μ', type: 'number', unit: 'Pa·s', min: 1e-6, step: '1e-6' }],
  defaults: { density: '1', velocity: '1', length: '1', viscosity: '1' },
  presets: [
    { label: 'Standard example 1', values: { density: '1', velocity: '1', length: '1', viscosity: '1' } },
    { label: 'Standard example 2', values: { density: '10', velocity: '10', length: '10', viscosity: '10' } },
    { label: 'Standard example 3', values: { density: '100', velocity: '100', length: '100', viscosity: '100' } },
  ],
  compute: (v) => { const Re = v.density * v.velocity * v.length / v.viscosity; const regime = Re < 2000 ? 'Laminar' : Re < 4000 ? 'Transitional' : 'Turbulent'; return { result: Re, label: 'Reynolds Number', unit: '', steps: [{ label: 'Formula', value: 'Re = ρvL/μ' }, { label: 'Result', value: `${Re.toFixed(1)}` }, { label: 'Flow regime', value: regime }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Reynolds number is the ratio of inertial forces to viscous forces in fluid flow. It determines whether flow is laminar or turbulent.',
  formula: 'Re = ρ·v·L / μ',
  interpretation: 'Re < 2000: laminar (smooth, predictable). Re > 4000: turbulent (chaotic, eddies). Pipe flow transition occurs around Re ≈ 2300. Turbulent flow increases drag and mixing.'
}

export default calcDef
