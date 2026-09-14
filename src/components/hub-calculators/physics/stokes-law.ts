import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ viscosity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'viscosity', label: 'Dynamic Viscosity η', type: 'number', unit: 'Pa·s', min: 1e-6, step: '1e-6' }, { name: 'radius', label: 'Sphere Radius r', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '0.001' }],
  defaults: { viscosity: '1', radius: '1', velocity: '1' },
  presets: [
    { label: 'Standard example 1', values: { viscosity: '1', radius: '1', velocity: '1' } },
    { label: 'Standard example 2', values: { viscosity: '10', radius: '10', velocity: '10' } },
    { label: 'Standard example 3', values: { viscosity: '100', radius: '100', velocity: '100' } },
  ],
  compute: (v) => { const Fd = 6 * Math.PI * v.viscosity * v.radius * v.velocity; return { result: Fd, label: 'Drag Force', unit: 'N', steps: [{ label: 'Formula', value: 'F_d = 6πηrv (Stokes)' }, { label: 'Substitute', value: `6π × ${v.viscosity} × ${v.radius} × ${v.velocity}` }, { label: 'Result', value: `${Fd.toExponential(4)} N` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Stokes\' Law gives the drag force on a sphere moving through a viscous fluid at low Reynolds numbers (laminar flow).',
  formula: 'F_d = 6π·η·r·v',
  interpretation: 'Valid only for Re < 1. Used to calculate sedimentation rate, terminal velocity of small particles, and the viscosity of fluids using falling-sphere viscometers. Stokes\' Law also describes the mobility of small organisms in water.'
}

export default calcDef
