import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), slitWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'slitWidth', label: 'Slit Width', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }],
  compute: (v) => { const theta = Math.asin(v.wavelength / v.slitWidth); const thetaDeg = theta * 180 / Math.PI; return { result: thetaDeg, label: 'First Minimum Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'a·sinθ = λ' }, { label: 'Substitute', value: `sinθ = ${v.wavelength}/${v.slitWidth}` }, { label: 'First minimum', value: `θ = ${thetaDeg.toFixed(2)}°` }, { label: 'Angular width', value: `2θ = ${(2 * thetaDeg).toFixed(2)}°` }] } },
  description: 'Single-slit diffraction: the first minimum occurs where a·sinθ = λ. The central maximum is twice as wide as side maxima.',
  formula: 'a·sin(θ) = λ',
  interpretation: 'A narrower slit produces wider diffraction patterns. Diffraction limits the resolution of optical instruments.'
}

export default calcDef
