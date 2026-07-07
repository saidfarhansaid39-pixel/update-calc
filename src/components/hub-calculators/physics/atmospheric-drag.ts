import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), cd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'density', label: 'Air Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1' }, { name: 'cd', label: 'Drag Coefficient C_d', type: 'number', unit: '', min: 0.01, step: '0.01' }, { name: 'area', label: 'Cross-Sectional Area A', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  compute: (v) => { const Fd = 0.5 * v.density * v.velocity * v.velocity * v.cd * v.area; return { result: Fd, label: 'Drag Force', unit: 'N', steps: [{ label: 'Formula', value: 'F_d = ½ρv²C_dA' }, { label: 'Substitute', value: `½ × ${v.density} × ${v.velocity}² × ${v.cd} × ${v.area}` }, { label: 'Result', value: `${Fd.toFixed(2)} N` }] } },
  description: 'Atmospheric drag opposes motion through air, proportional to density, velocity squared, cross-sectional area, and drag coefficient.',
  formula: 'F_d = ½·ρ·v²·C_d·A',
  interpretation: 'Drag increases with velocity squared — doubling speed quadruples drag. C_d ≈ 0.5 for a sphere, 0.04 for a streamlined car. Drag limits the top speed of vehicles.'
}

export default calcDef
