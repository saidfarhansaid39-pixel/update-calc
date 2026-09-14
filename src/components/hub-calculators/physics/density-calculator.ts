import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'volume', label: 'Volume', type: 'number', unit: 'm^3', min: 0.001, step: '0.001' }],
  defaults: { mass: '1', volume: '0.001' },
  presets: [
    { label: 'Water (1 L / 1 kg)', values: { mass: '1', volume: '0.001' } },
    { label: 'Gold bar (1 kg, 51.8 cm³)', values: { mass: '1', volume: '0.0000518' } },
    { label: 'Air (1 m³, 1.225 kg)', values: { mass: '1.225', volume: '1' } },
  ],
  compute: (v) => ({ result: v.mass / v.volume, label: 'Density', unit: 'kg/m^3', steps: [{ label: 'Formula', value: 'ρ = m/V' }, { label: 'Substitute', value: `${v.mass} / ${v.volume}` }, { label: 'Result', value: `${(v.mass / v.volume).toFixed(2)} kg/m^3` }],
      extras: [
        { label: 'Real-World Application', value: 'Density determines buoyancy (why ships float), material identification, and quality control. Gold (19,300 kg/m³) is twice as dense as lead (11,340).' },
        { label: 'Common Values', value: 'Air: 1.225 kg/m³. Water: 1000 kg/m³. Aluminum: 2700. Iron: 7874. Copper: 8960. Lead: 11,340. Gold: 19,300. Osmium: 22,590 (densest element).' },
        { label: 'Precision Tip', value: 'Density varies with temperature and pressure. Most substances expand when heated (lower density). Water is densest at 4°C.' },
        { label: 'Related Formula', value: 'ρ = m/V. Specific gravity = ρ/ρ_water. Buoyant force: F_b = ρ_fluid × V × g. Ideal gas: ρ = PM/RT.' },
        { label: 'Unit Conversion Note', value: 'Standard: kg/m³. 1 g/cm³ = 1000 kg/m³. 1 kg/L = 1000 kg/m³. Water: 1 g/cm³ = 1000 kg/m³.' }
      ] }),
  description: 'Density is mass per unit volume. It is a material property that indicates how compact a substance is.',
  formula: 'ρ = m / V',
  interpretation: 'Density varies with temperature and pressure. Water density is ~1000 kg/m^3 at 4°C. Density determines buoyancy.'
}

export default calcDef
