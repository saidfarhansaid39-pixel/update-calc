import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), theta1: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'n1', label: 'Refractive Index 1', type: 'number', unit: '', min: 1, step: '0.001' }, { name: 'n2', label: 'Refractive Index 2', type: 'number', unit: '', min: 1, step: '0.001' }, { name: 'theta1', label: 'Angle of Incidence', type: 'number', unit: 'degrees', min: 0, max: 89, step: '1' }],
  defaults: { n1: '1', n2: '1', theta1: '1' },
  presets: [
    { label: 'Standard example 1', values: { n1: '1', n2: '1', theta1: '1' } },
    { label: 'Standard example 2', values: { n1: '10', n2: '10', theta1: '10' } },
    { label: 'Standard example 3', values: { n1: '100', n2: '100', theta1: '100' } },
  ],
  compute: (v) => { const rad1 = v.theta1 * Math.PI / 180; const sinTheta2 = v.n1 * Math.sin(rad1) / v.n2; const theta2 = sinTheta2 <= 1 ? Math.asin(sinTheta2) * 180 / Math.PI : 90; return { result: theta2, label: 'Angle of Refraction', unit: 'degrees', steps: [{ label: 'Formula', value: 'n₁sinθ₁ = n₂sinθ₂' }, { label: 'Result', value: `θ₂ = ${theta2.toFixed(2)}°` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Snell\'s Law describes the angle of refraction when light passes between media with different refractive indices.',
  formula: 'n₁·sin(θ₁) = n₂·sin(θ₂)',
  interpretation: 'Light bends toward the normal entering a denser medium (n₂ > n₁). Total internal reflection occurs when sinθ₂ > 1. The critical angle θ_c = arcsin(n₂/n₁) when n₁ > n₂.'
}

export default calcDef
