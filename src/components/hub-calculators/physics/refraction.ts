import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), theta1: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'n1', label: 'Incident Index', type: 'number', unit: '', min: 1, step: '0.01' }, { name: 'n2', label: 'Refractive Index', type: 'number', unit: '', min: 1, step: '0.01' }, { name: 'theta1', label: 'Angle of Incidence', type: 'number', unit: 'degrees', min: 0, max: 89, step: '1' }],
  compute: (v) => { const rad1 = v.theta1 * Math.PI / 180; const sinTheta2 = v.n1 * Math.sin(rad1) / v.n2; const theta2 = sinTheta2 <= 1 ? Math.asin(sinTheta2) * 180 / Math.PI : 90; const crit = v.n1 > v.n2 ? Math.asin(v.n2 / v.n1) * 180 / Math.PI : null; return { result: theta2, label: 'Angle of Refraction', unit: 'degrees', steps: [{ label: 'Formula', value: 'n1sinθ1 = n2sinθ2' }, { label: 'Result', value: `θ2 = ${theta2.toFixed(2)}°` }, ...(crit !== null ? [{ label: 'Critical angle', value: `${crit.toFixed(2)}°` }] : [])] } },
  description: 'Refraction is the bending of light when it passes between media of different refractive indices.',
  formula: 'n1sin(θ1) = n2sin(θ2)',
  interpretation: 'Light slows in denser media. When n1 > n2, total internal reflection occurs beyond the critical angle.'
}

export default calcDef
