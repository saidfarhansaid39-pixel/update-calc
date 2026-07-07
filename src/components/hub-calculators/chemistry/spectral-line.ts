import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    wavelength: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'wavelength', label: 'Wavelength of Spectral Line', type: 'number', unit: 'nm', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const λ = v.wavelength * 1e-9
    const ν = 2.998e8 / λ
    const E = 6.626e-34 * ν
    const region = λ < 1e-8 ? 'Gamma/X-ray' : λ < 4e-7 ? 'Ultraviolet' : λ < 7e-7 ? 'Visible' : λ < 1e-3 ? 'Infrared' : 'Microwave/Radio'
    return {
      result: E, label: 'Photon Energy of Spectral Line', unit: 'J',
      steps: [
        { label: 'λ', value: `${v.wavelength} nm` },
        { label: 'ν = c/λ', value: `${ν.toExponential(4)} Hz` },
        { label: 'E = hν', value: `${E.toExponential(4)} J` },
        { label: 'Spectral region', value: region },
        { label: 'ΔE (kJ/mol)', value: `${(E * 6.022e23 / 1000).toFixed(2)} kJ/mol` },
      ]
}
  },
  description: 'Each spectral line corresponds to a specific electronic transition between energy levels in atoms or molecules. The wavelength, frequency, and energy are related by E = hc/λ.',
  formula: 'E = hc/λ = hν | ΔE = E₂ - E₁ | Spectral region depends on λ',
  interpretation: 'Visible spectral lines (400-700 nm) arise from valence electron transitions. The sodium D-line at 589 nm gives yellow streetlights. Each element has a unique spectral fingerprint.'
}

export default calcDef
