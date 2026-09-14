import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), latent: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'latent', label: 'Latent Heat', type: 'number', unit: 'J/kg', min: 1, step: '1' }],
  defaults: { mass: '1', tempChange: '10', specificHeat: '4186' },
  presets: [
    { label: 'Heat 1 L water by 10°C', values: { mass: '1', tempChange: '10', specificHeat: '4186' } },
    { label: 'Heat 1 kg aluminum by 50°C', values: { mass: '1', tempChange: '50', specificHeat: '900' } },
    { label: 'Melt 1 kg ice (334 kJ/kg)', values: { mass: '1', latentHeat: '334000' } },
  ],
  compute: (v) => ({ result: v.mass * v.latent, label: 'Heat Energy', unit: 'J', steps: [{ label: 'Formula', value: 'Q = mL' }, { label: 'Substitute', value: `${v.mass} × ${v.latent}` }, { label: 'Result', value: `${(v.mass * v.latent).toFixed(2)} J` }],
      extras: [
        { label: 'Real-World Application', value: 'Specific heat determines cooking times, HVAC sizing, and climate patterns. Water\'s high specific heat (4186 J/(kg·°C)) stabilizes coastal temperatures.' },
        { label: 'Common Values', value: 'Water: 4186 J/(kg·°C). Aluminum: 900. Copper: 385. Iron: 450. Ice: 2090. Air: 1005. Water\'s heat capacity is the highest of common substances.' },
        { label: 'Precision Tip', value: 'Specific heat varies with temperature. Values are typically given at 25°C. Phase changes require latent heat and occur at constant temperature.' },
        { label: 'Related Formula', value: 'Q = mcΔT. Latent heat: Q = mL. Heat capacity: C = mc. Thermal equilibrium: m₁c₁(T_f - T₁) = m₂c₂(T₂ - T_f).' },
        { label: 'Unit Conversion Note', value: '1 cal = 4.184 J. 1 food Calorie (kcal) = 4184 J. 1 BTU = 1055 J (heats 1 lb water by 1°F).' }
      ] }),
  description: 'Latent heat is the energy absorbed or released during a phase change without a temperature change.',
  formula: 'Q = m·L',
  interpretation: 'Latent heat of fusion (melting/freezing) for water is 334 kJ/kg. Latent heat of vaporization is 2260 kJ/kg. During phase change, temperature remains constant.'
}

export default calcDef
