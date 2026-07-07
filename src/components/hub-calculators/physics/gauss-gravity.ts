import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Enclosed Mass M_enc', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'radius', label: 'Gaussian Radius r', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const G = 6.674e-11; const g = -G * v.mass / (v.radius * v.radius); const flux = -4 * Math.PI * G * v.mass; return { result: g, label: 'Gravitational Field g', unit: 'm/s²', steps: [{ label: 'Formula', value: '∮g·dA = -4πGM_enc (Gauss\' Law)' }, { label: 'Field at r', value: `${g.toExponential(4)} m/s²` }, { label: 'Total flux', value: `${flux.toExponential(4)} N·m²/kg` }] } },
  description: 'Gauss\'s Law for gravity: the gravitational flux through a closed surface equals -4πG times the enclosed mass.',
  formula: '∮g·dA = -4πG·M_enc',
  interpretation: 'Gauss\'s Law simplifies field calculations for symmetric mass distributions. Outside a sphere, the field is as if all mass were at the center. Inside a uniform sphere, field is proportional to radius.'
}

export default calcDef
