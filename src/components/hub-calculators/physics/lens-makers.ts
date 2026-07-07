import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r1: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), r2: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero') }),
  fields: [{ name: 'n', label: 'Lens Refractive Index', type: 'number', unit: '', min: 1, step: '0.01' }, { name: 'r1', label: 'First Radius (R₁)', type: 'number', unit: 'm', step: '0.1' }, { name: 'r2', label: 'Second Radius (R₂)', type: 'number', unit: 'm', step: '0.1' }],
  compute: (v) => { const P = (v.n - 1) * (1 / v.r1 - 1 / v.r2); const f = 1 / P; return { result: f, label: 'Focal Length', unit: 'm', steps: [{ label: 'Formula', value: '1/f = (n-1)(1/R₁ - 1/R₂)' }, { label: 'Power P', value: `${P.toFixed(2)} D` }, { label: 'Focal length', value: `${f.toFixed(3)} m` }] } },
  description: 'The lens maker\'s equation calculates the focal length of a thin lens given its refractive index and surface radii of curvature.',
  formula: '1/f = (n-1)(1/R₁ - 1/R₂)',
  interpretation: 'R is positive for convex surfaces, negative for concave. Power P = 1/f is measured in diopters (D). A typical eyeglass lens has power of +1 to +4 D.'
}

export default calcDef
