import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm1', label: 'Primary Mass M₁', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'm2', label: 'Secondary Mass M₂', type: 'number', unit: 'kg', min: 1e15, step: '1e15' }, { name: 'r', label: 'Separation Distance R', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const mu = v.m2 / (v.m1 + v.m2); const L1 = v.r * (1 - Math.pow(mu / 3, 1/3)); const L2 = v.r * (1 + Math.pow(mu / 3, 1/3)); return { result: L1, label: 'L1 Distance from Primary', unit: 'm', steps: [{ label: 'Formula', value: 'L₁ ≈ R(1 - (μ/3)^(1/3))' }, { label: 'Mass ratio μ', value: `${mu.toExponential(4)}` }, { label: 'L₁ distance', value: `${L1.toExponential(4)} m` }, { label: 'L₂ distance', value: `${L2.toExponential(4)} m` }] } },
  description: 'Lagrange points are positions of gravitational equilibrium in a two-body system. L₁-L₃ are collinear (unstable), L₄-L₅ are triangular (stable).',
  formula: "L₁ ≈ R(1 - (μ/3)^(1/3)), μ = M₂/(M₁+M₂)",
  interpretation: 'JWST orbits the Sun-Earth L₂ point, ~1.5 million km from Earth. Sun-Earth L₁ hosts solar observatories. Trojan asteroids occupy Jupiter-Sun L₄ and L₅ points.'
}

export default calcDef
