import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), latent: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'latent', label: 'Latent Heat', type: 'number', unit: 'J/kg', min: 1, step: '1' }],
  compute: (v) => ({ result: v.mass * v.latent, label: 'Heat Energy', unit: 'J', steps: [{ label: 'Formula', value: 'Q = mL' }, { label: 'Substitute', value: `${v.mass} × ${v.latent}` }, { label: 'Result', value: `${(v.mass * v.latent).toFixed(2)} J` }] }),
  description: 'Latent heat is the energy absorbed or released during a phase change without a temperature change.',
  formula: 'Q = m·L',
  interpretation: 'Latent heat of fusion (melting/freezing) for water is 334 kJ/kg. Latent heat of vaporization is 2260 kJ/kg. During phase change, temperature remains constant.'
}

export default calcDef
