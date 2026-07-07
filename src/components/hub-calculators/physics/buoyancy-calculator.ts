import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'volume', label: 'Displaced Volume', type: 'number', unit: 'm^3', min: 0.001, step: '0.001' }, { name: 'density', label: 'Fluid Density', type: 'number', unit: 'kg/m^3', min: 1, step: '1' }],
  compute: (v) => ({ result: v.volume * v.density * 9.81, label: 'Buoyant Force', unit: 'N', steps: [{ label: 'Formula', value: 'Fբ = ρ·V·g (Archimedes)' }, { label: 'Substitute', value: `${v.density} × ${v.volume} × 9.81` }, { label: 'Result', value: `${(v.volume * v.density * 9.81).toFixed(3)} N` }] }),
  description: 'Archimedes\' Principle: the buoyant force equals the weight of the fluid displaced by the object.',
  formula: 'Fբ = ρ·V·g',
  interpretation: 'If the buoyant force exceeds the object\'s weight, it floats. If less, it sinks. If equal, it is neutrally buoyant.'
}

export default calcDef
