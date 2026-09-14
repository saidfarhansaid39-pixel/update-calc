import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n1', label: 'Denser Medium Index', type: 'number', unit: '', min: 1, step: '0.01' }, { name: 'n2', label: 'Less Dense Medium Index', type: 'number', unit: '', min: 1, step: '0.01' }],
  defaults: { n1: '1', n2: '1' },
  presets: [
    { label: 'Standard example 1', values: { n1: '1', n2: '1' } },
    { label: 'Standard example 2', values: { n1: '10', n2: '10' } },
    { label: 'Standard example 3', values: { n1: '100', n2: '100' } },
  ],
  compute: (v) => { const crit = v.n1 > v.n2 ? Math.asin(v.n2 / v.n1) * 180 / Math.PI : 90; return { result: crit, label: 'Critical Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'θ_c = arcsin(n₂/n₁)' }, { label: 'Result', value: `${crit.toFixed(2)}°` }, { label: 'Condition', value: v.n1 > v.n2 ? 'Total internal reflection possible' : 'No total internal reflection (n₁ ≤ n₂)' }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The critical angle is the angle of incidence beyond which light is entirely reflected within the denser medium (total internal reflection).',
  formula: 'θ_c = arcsin(n₂/n₁), n₁ > n₂',
  interpretation: 'Total internal reflection requires n₁ > n₂. Fiber optics relies on TIR to guide light. Water-air critical angle is ~48.6°. Diamond-air critical angle is ~24.4° (causing sparkle).'
}

export default calcDef
