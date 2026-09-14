import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), cd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'density', label: 'Air Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'cd', label: 'Drag Coefficient C_d', type: 'number', unit: '', min: 0.01, step: '0.01' }, { name: 'area', label: 'Cross-Sectional Area A', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  defaults: { density: '1', velocity: '1', cd: '1', area: '1' },
  presets: [
    { label: 'Standard example 1', values: { density: '1', velocity: '1', cd: '1', area: '1' } },
    { label: 'Standard example 2', values: { density: '10', velocity: '10', cd: '10', area: '10' } },
    { label: 'Standard example 3', values: { density: '100', velocity: '100', cd: '100', area: '100' } },
  ],
  compute: (v) => { const Fd = 0.5 * v.density * v.velocity * v.velocity * v.cd * v.area; return { result: Fd, label: 'Drag Force', unit: 'N', steps: [{ label: 'Formula', value: 'F_d = ½ρv²C_dA' }, { label: 'Substitute', value: `½ × ${v.density} × ${v.velocity}² × ${v.cd} × ${v.area}` }, { label: 'Result', value: `${Fd.toFixed(2)} N` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Atmospheric drag opposes motion through air, proportional to density, velocity squared, cross-sectional area, and drag coefficient.',
  formula: 'F_d = ½·ρ·v²·C_d·A',
  interpretation: 'Drag increases with velocity squared — doubling speed quadruples drag. C_d ≈ 0.5 for a sphere, 0.04 for a streamlined car. Drag limits the top speed of vehicles.'
}

export default calcDef
