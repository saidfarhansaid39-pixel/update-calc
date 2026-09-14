import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Drag Force F_d', type: 'number', unit: 'N', min: 0.01, step: '0.01' }, { name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0.1, step: '0.1' }, { name: 'area', label: 'Cross-Sectional Area A', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  defaults: { force: '1', density: '1', velocity: '1', area: '1' },
  presets: [
    { label: 'Standard example 1', values: { force: '1', density: '1', velocity: '1', area: '1' } },
    { label: 'Standard example 2', values: { force: '10', density: '10', velocity: '10', area: '10' } },
    { label: 'Standard example 3', values: { force: '100', density: '100', velocity: '100', area: '100' } },
  ],
  compute: (v) => { const Cd = 2 * v.force / (v.density * v.velocity * v.velocity * v.area); return { result: Cd, label: 'Drag Coefficient C_d', unit: '', steps: [{ label: 'Formula', value: 'C_d = 2F_d/(ρv²A)' }, { label: 'Substitute', value: `2 × ${v.force} / (${v.density} × ${v.velocity}² × ${v.area})` }, { label: 'Result', value: `${Cd.toFixed(4)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The drag coefficient is a dimensionless number that quantifies the drag resistance of an object in a fluid environment.',
  formula: 'C_d = 2F_d/(ρ·v²·A)',
  interpretation: 'C_d ≈ 0.5 for a sphere, 0.04 for a streamlined car, 1.0-1.3 for a flat plate perpendicular to flow, ~0.3 for a modern car. Lower C_d means better aerodynamics.'
}

export default calcDef
