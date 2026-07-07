import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ linesPerMm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), order: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 0 && n <= 10 }, '0-10') }),
  fields: [{ name: 'linesPerMm', label: 'Lines per mm', type: 'number', unit: 'mm^-1', min: 1, step: '1' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 1e-9, step: '1e-9' }, { name: 'order', label: 'Order m', type: 'number', unit: '', min: 0, max: 10, step: '1' }],
  compute: (v) => { const d = 0.001 / v.linesPerMm; const theta = Math.asin(v.order * v.wavelength / d); const thetaDeg = theta * 180 / Math.PI; return { result: thetaDeg, label: 'Diffraction Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'd·sinθ = mλ' }, { label: 'Grating spacing d', value: `${d.toExponential(6)} m` }, { label: 'Angle', value: `θ = ${thetaDeg.toFixed(3)}°` }] } },
  description: 'A diffraction grating produces sharp maxima at angles where d·sinθ = mλ. More lines produce sharper, brighter maxima than double slits.',
  formula: 'd·sin(θ) = mλ, d = 1/N',
  interpretation: 'N is lines per meter. Gratings with more lines per mm spread colors more. Used in spectrometers to analyze light spectra. A CD surface acts as a reflection grating.'
}

export default calcDef
