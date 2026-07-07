import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'volume', label: 'Displaced Volume V', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'density', label: 'Fluid Density ρ', type: 'number', unit: 'kg/m³', min: 1, step: '1' }],
  compute: (v) => { const Fb = v.density * 9.81 * v.volume; return { result: Fb, label: 'Buoyant Force', unit: 'N', steps: [{ label: 'Formula', value: 'F_b = ρgV (Archimedes)' }, { label: 'Substitute', value: `${v.density} × 9.81 × ${v.volume}` }, { label: 'Result', value: `${Fb.toFixed(3)} N` }] } },
  description: 'Archimedes\' Principle: the buoyant force equals the weight of the fluid displaced by the object.',
  formula: 'F_b = ρ·g·V',
  interpretation: 'An object floats if its density is less than the fluid density. A 1 m³ object submerged in water (ρ ≈ 1000 kg/m³) experiences F_b ≈ 9810 N. Iron sinks (7870 kg/m³), wood floats (400-800 kg/m³).'
}

export default calcDef
