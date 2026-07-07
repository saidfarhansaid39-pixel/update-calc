import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ incident: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 90 }, '0-90') }),
  fields: [{ name: 'incident', label: 'Angle of Incidence', type: 'number', unit: 'degrees', min: 0, max: 90, step: '1' }],
  compute: (v) => ({ result: v.incident, label: 'Angle of Reflection', unit: 'degrees', steps: [{ label: 'Law of Reflection', value: 'θᵣ = θᵢ' }, { label: 'Substitute', value: `θᵣ = ${v.incident}°` }, { label: 'Result', value: `${v.incident}°` }] }),
  description: 'The law of reflection states that the angle of incidence equals the angle of reflection, measured from the normal.',
  formula: 'θᵣ = θᵢ',
  interpretation: 'Reflection occurs when light bounces off a surface. Specular reflection (smooth surfaces) preserves image clarity; diffuse reflection (rough surfaces) scatters light.'
}

export default calcDef
