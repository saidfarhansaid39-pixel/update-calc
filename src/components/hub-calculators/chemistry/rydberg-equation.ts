import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n1: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10'),
    n2: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 2 && n <= 20 }, '2-20')
}),
  fields: [
    { name: 'n1', label: 'Lower Energy Level (n₁)', type: 'number', unit: '', min: 1, max: 10, step: '1' },
    { name: 'n2', label: 'Higher Energy Level (n₂)', type: 'number', unit: '', min: 2, max: 20, step: '1' },
  ],
  compute: (v) => {
    if (v.n2 <= v.n1) return { result: 'n₂ must be > n₁', label: 'Error', unit: '', steps: [] }
    const R = 1.097373e7
    const wavenumber = R * (1 / Math.pow(v.n1, 2) - 1 / Math.pow(v.n2, 2))
    const λ = 1 / wavenumber
    const series = v.n1 === 1 ? 'Lyman (UV)' : v.n1 === 2 ? 'Balmer (visible)' : v.n1 === 3 ? 'Paschen (IR)' : v.n1 === 4 ? 'Brackett (IR)' : 'Pfund (far IR)'
    return {
      result: λ * 1e9, label: 'Wavelength λ', unit: 'nm',
      steps: [
        { label: 'n₁ (lower)', value: `${v.n1}` },
        { label: 'n₂ (upper)', value: `${v.n2}` },
        { label: '1/λ = R(1/n₁² - 1/n₂²)', value: `${wavenumber.toExponential(4)} m⁻¹` },
        { label: 'λ', value: `${(λ * 1e9).toFixed(2)} nm` },
        { label: 'Spectral series', value: series },
      ]
}
  },
  description: 'The Rydberg equation calculates the wavelength of light emitted or absorbed when an electron transitions between energy levels in a hydrogen atom. 1/λ = R(1/n₁² - 1/n₂²).',
  formula: '1/λ = R_H × (1/n₁² - 1/n₂²) | R_H = 1.097 × 10⁷ m⁻¹',
  interpretation: 'The Lyman series (n₁ = 1) is in the UV. The Balmer series (n₁ = 2) is in the visible spectrum. Hα (n₂ = 3 → n₁ = 2) = 656 nm (red). Hβ (n₂ = 4 → n₁ = 2) = 486 nm (blue-green).'
}

export default calcDef
