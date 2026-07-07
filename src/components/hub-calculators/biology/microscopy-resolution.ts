import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    wavelength: z.string().refine(v => parseFloat(v) > 0, '>0'),
    na: z.string().refine(v => { const n = parseFloat(v); return n > 0 && n < 2 }, '0-2')
}),
  fields: [
    { name: 'wavelength', label: 'Wavelength of Light', type: 'number', unit: 'nm', min: 200, max: 800, step: '10' },
    { name: 'na', label: 'Numerical Aperture (NA)', type: 'number', min: 0.1, max: 1.7, step: '0.01' },
  ],
  compute: (v) => {
    const resolution = 0.61 * v.wavelength / v.na
    return {
      result: resolution, label: 'Abbe Resolution Limit', unit: 'nm',
      steps: [
        { label: 'Wavelength (?)', value: `${v.wavelength} nm` },
        { label: 'Numerical aperture (NA)', value: `${v.na.toFixed(2)}` },
        { label: 'd = 0.61 × ? / NA', value: `${resolution.toFixed(1)} nm` },
        { label: 'Resolution (µm)', value: `${(resolution / 1000).toFixed(3)} µm` },
        { label: 'Nyquist sampling', value: `Pixel size should be = ${(resolution / 2 / 1000).toFixed(3)} µm for optimal sampling` },
      ]
}
  },
  description: 'The Abbe diffraction limit defines the minimum resolvable distance between two points in light microscopy. It depends on wavelength and numerical aperture of the objective.',
  formula: 'd = 0.61 × ? / NA (Abbe) | dmin = ? / (2 × NA) (Rayleigh criterion) | Resolution improves with shorter ? and higher NA',
  interpretation: 'Best conventional resolution: ~200 nm laterally, ~500 nm axially. Super-resolution techniques (STED, STORM, PALM) overcome this limit. Oil immersion objectives (NA 1.4-1.5) give best resolution.'
}

export default calcDef
