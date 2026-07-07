import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 1, step: '1' }, { name: 'depth', label: 'Depth h', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  compute: (v) => { const P = v.density * 9.81 * v.depth; return { result: P, label: 'Gauge Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: 'P = ρgh' }, { label: 'Substitute', value: `${v.density} × 9.81 × ${v.depth}` }, { label: 'Result', value: `${P.toFixed(1)} Pa (${(P / 101325).toFixed(3)} atm)` }] } },
  description: 'Hydrostatic pressure increases linearly with depth in a fluid. P = ρgh, where h is depth below the surface.',
  formula: 'P = ρ·g·h',
  interpretation: 'Water pressure increases by 1 atm every ~10 m depth. At 1000 m depth in the ocean, pressure ≈ 100 atm. Absolute pressure = atmospheric + gauge pressure.'
}

export default calcDef
