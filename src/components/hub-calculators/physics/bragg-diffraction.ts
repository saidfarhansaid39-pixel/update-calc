import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ spacing: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), order: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'spacing', label: 'Crystal Lattice Spacing', type: 'number', unit: 'nm', min: 0.01, step: '0.01' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'nm', min: 0.001, step: '0.001' }, { name: 'order', label: 'Order n', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  compute: (v) => { const nm = 1e-9; const sinTheta = v.order * v.wavelength * nm / (2 * v.spacing * nm); const theta = sinTheta <= 1 ? Math.asin(sinTheta) * 180 / Math.PI : 90; return { result: theta, label: 'Bragg Angle', unit: 'degrees', steps: [{ label: 'Formula', value: '2d·sinθ = nλ' }, { label: 'Result', value: `θ = ${theta.toFixed(2)}°` }] } },
  description: 'Bragg\'s Law describes X-ray diffraction from crystal lattice planes. Constructive interference occurs when 2d·sinθ = nλ.',
  formula: '2d·sin(θ) = nλ',
  interpretation: 'X-ray crystallography uses Bragg diffraction to determine atomic structures. The diffraction pattern reveals the crystal\'s 3D atomic arrangement. DNA structure was discovered this way.'
}

export default calcDef
