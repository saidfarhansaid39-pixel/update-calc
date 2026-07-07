import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), specificHeat: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' }, { name: 'specificHeat', label: 'Specific Heat', type: 'number', unit: 'J/(kg·°C)', min: 1, step: '1' }],
  compute: (v) => ({ result: v.mass * v.specificHeat * v.tempChange, label: 'Heat Energy', unit: 'J', steps: [{ label: 'Formula', value: 'Q = mcΔT' }, { label: 'Substitute', value: `${v.mass} × ${v.specificHeat} × ${v.tempChange}` }, { label: 'Result', value: `${(v.mass * v.specificHeat * v.tempChange).toFixed(2)} J` }] }),
  description: 'Specific heat capacity determines how much heat energy is required to change a substance\'s temperature.',
  formula: 'Q = mcΔT',
  interpretation: 'Water has a high specific heat (4186 J/(kg·°C)), meaning it requires more energy to heat than most substances.'
}

export default calcDef
