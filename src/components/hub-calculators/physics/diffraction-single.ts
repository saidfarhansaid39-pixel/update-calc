import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), slitWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'slitWidth', label: 'Slit Width', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }],
  compute: (v) => { const theta = Math.asin(v.wavelength / v.slitWidth); const thetaDeg = theta * 180 / Math.PI; return { result: thetaDeg, label: 'First Minimum Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'a·sinθ = λ' }, { label: 'Result', value: `θ = ${thetaDeg.toFixed(3)}°` }, { label: 'Angular width', value: `2θ = ${(2 * thetaDeg).toFixed(3)}°` }] } },
  description: 'Single-slit diffraction produces a central bright maximum twice as wide as the side maxima. The first minimum occurs at a·sinθ = λ.',
  formula: 'a·sin(θ) = mλ (m = 1 for first minimum)',
  interpretation: 'Narrower slits produce wider diffraction patterns. The central maximum width is 2λ/a. Diffraction limits the resolution of all optical instruments.'
}

export default calcDef
