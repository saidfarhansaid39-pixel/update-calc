import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ incident: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 90 }, '0-90') }),
  fields: [{ name: 'incident', label: 'Angle of Incidence', type: 'number', unit: 'degrees', min: 0, max: 90, step: '1' }],
  defaults: { incident: '1' },
  presets: [
    { label: 'Standard example 1', values: { incident: '1' } },
    { label: 'Standard example 2', values: { incident: '10' } },
    { label: 'Standard example 3', values: { incident: '100' } },
  ],
  compute: (v) => ({ result: v.incident, label: 'Angle of Reflection', unit: 'degrees', steps: [{ label: 'Law of Reflection', value: 'θᵣ = θᵢ' }, { label: 'Substitute', value: `θᵣ = ${v.incident}°` }, { label: 'Result', value: `${v.incident}°` }],
      extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ] }),
  description: 'The law of reflection states that the angle of incidence equals the angle of reflection, measured from the normal.',
  formula: 'θᵣ = θᵢ',
  interpretation: 'Reflection occurs when light bounces off a surface. Specular reflection (smooth surfaces) preserves image clarity; diffuse reflection (rough surfaces) scatters light.'
}

export default calcDef
