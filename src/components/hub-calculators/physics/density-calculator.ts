import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'volume', label: 'Volume', type: 'number', unit: 'm^3', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.mass / v.volume, label: 'Density', unit: 'kg/m^3', steps: [{ label: 'Formula', value: 'ρ = m/V' }, { label: 'Substitute', value: `${v.mass} / ${v.volume}` }, { label: 'Result', value: `${(v.mass / v.volume).toFixed(2)} kg/m^3` }] }),
  description: 'Density is mass per unit volume. It is a material property that indicates how compact a substance is.',
  formula: 'ρ = m / V',
  interpretation: 'Density varies with temperature and pressure. Water density is ~1000 kg/m^3 at 4°C. Density determines buoyancy.'
}

export default calcDef
