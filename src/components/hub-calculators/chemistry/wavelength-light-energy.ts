import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    wavelength: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    unit: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'wavelength', label: 'Wavelength (λ)', type: 'number', unit: '', min: 0.0001, step: 'any' },
    { name: 'unit', label: 'Wavelength Unit', type: 'select', options: [
      { label: 'nm (nanometers)', value: 'nm' },
      { label: 'Å (angstroms)', value: 'ang' },
      { label: 'μm (micrometers)', value: 'um' },
      { label: 'm (meters)', value: 'm' },
    ] },
  ],
  compute: (v) => {
    const h = 6.626e-34, c = 2.998e8
    const λm: Record<string, number> = { 'nm': 1e-9, 'ang': 1e-10, 'um': 1e-6, 'm': 1 }
    const λ = v.wavelength * λm[v.unit]
    const E = h * c / λ
    const ν = c / λ
    return {
      result: E, label: 'Photon Energy (E)', unit: 'J',
      steps: [
        { label: 'λ', value: `${v.wavelength} ${v.unit} (${λ.toExponential(4)} m)` },
        { label: 'ν = c/λ', value: `${ν.toExponential(4)} Hz` },
        { label: 'E = hν = hc/λ', value: `${E.toExponential(4)} J` },
        { label: 'E in eV', value: `${(E / 1.602e-19).toFixed(3)} eV` },
        { label: 'E in kJ/mol', value: `${(E * 6.022e23 / 1000).toFixed(2)} kJ/mol` },
      ]
}
  },
  description: 'The energy of a photon is inversely proportional to its wavelength: E = hc/λ. Shorter wavelengths (blue light, UV, X-rays) have higher energy than longer wavelengths (red light, infrared, radio).',
  formula: 'E = hc/λ = hν',
  interpretation: 'Visible light: 400-700 nm. Violet (400 nm) has 1.8× the energy of red (700 nm). UV light (λ < 300 nm) has enough energy to break chemical bonds and damage DNA.'
}

export default calcDef
