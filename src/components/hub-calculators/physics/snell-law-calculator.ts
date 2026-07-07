import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), theta1: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'n1', label: 'Medium 1 Index', type: 'number', unit: '', min: 1, step: '0.001' }, { name: 'n2', label: 'Medium 2 Index', type: 'number', unit: '', min: 1, step: '0.001' }, { name: 'theta1', label: 'Angle of Incidence', type: 'number', unit: 'degrees', min: 0, max: 89, step: '1' }],
  compute: (v) => { const rad1 = v.theta1 * Math.PI / 180; const sinTheta2 = v.n1 * Math.sin(rad1) / v.n2; const theta2 = sinTheta2 <= 1 ? Math.asin(sinTheta2) * 180 / Math.PI : 90; return { result: theta2, label: 'Angle of Refraction', unit: 'degrees', steps: [{ label: 'Formula', value: 'n1sinθ1 = n2sinθ2' }, { label: 'Substitute', value: `${v.n1}×sin(${v.theta1}°) = ${v.n2}×sin(θ2)` }, { label: 'Result', value: `θ2 = ${theta2.toFixed(2)}°` }] } },
  description: 'Snell\'s Law describes how light bends when passing from one medium to another with different refractive indices.',
  formula: 'n1·sin(θ1) = n2·sin(θ2)',
  interpretation: 'Light bends toward the normal when entering a denser medium and away when entering a less dense medium. Total internal reflection occurs when sin(θ2) > 1.'
}

export default calcDef
