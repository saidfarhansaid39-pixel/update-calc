import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 0.01, step: '0.01' }, { name: 'cd', label: 'Drag Coefficient C_d', type: 'number', unit: '', min: 0.01, step: '0.01' }, { name: 'area', label: 'Cross-Sectional Area A', type: 'number', unit: 'm²', min: 0.001, step: '0.001' }],
  compute: (v) => { const g = 9.81; const vt = Math.sqrt(2 * v.mass * g / (v.density * v.cd * v.area)); return { result: vt, label: 'Terminal Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v_t = √(2mg/(ρC_dA))' }, { label: 'Weight', value: `${(v.mass * g).toFixed(1)} N` }, { label: 'Terminal velocity', value: `${vt.toFixed(1)} m/s (${(vt * 3.6).toFixed(1)} km/h)` }] } },
  description: 'Terminal velocity is the constant speed reached when the drag force equals the gravitational force. Accelerating force is balanced by drag.',
  formula: 'v_t = √(2mg/(ρ·C_d·A))',
  interpretation: 'A skydiver in spread position has v_t ≈ 55 m/s (200 km/h). A skydiver in head-down position reaches v_t ≈ 90 m/s (320 km/h). A raindrop has v_t ≈ 9 m/s. Heavier objects have higher terminal velocity.'
}

export default calcDef
