import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), slitSep: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), order: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10') }),
  fields: [{ name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'slitSep', label: 'Slit Separation', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'order', label: 'Order m', type: 'number', unit: '', min: 0, max: 10, step: '1' }],
  compute: (v) => { const theta = Math.asin(v.order * v.wavelength / v.slitSep); const thetaDeg = theta * 180 / Math.PI; return { result: thetaDeg, label: 'Angle to Maxima', unit: 'degrees', steps: [{ label: 'Formula', value: 'd·sinθ = mλ' }, { label: 'Substitute', value: `sinθ = ${v.order}×${v.wavelength}/${v.slitSep}` }, { label: 'Result', value: `θ = ${thetaDeg.toFixed(2)}°` }] } },
  description: 'Young\'s double-slit interference: constructive interference produces bright fringes at angles where d·sinθ = mλ.',
  formula: 'd·sin(θ) = mλ',
  interpretation: 'Bright fringes occur when path difference is an integer multiple of wavelength. m = 0 is the central maximum.'
}

export default calcDef
