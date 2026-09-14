import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 1, step: '1' }],
  defaults: { wavelength: '5e-7' },
  presets: [
    { label: 'Red light (700 nm)', values: { wavelength: '7e-7' } },
    { label: 'Blue light (450 nm)', values: { wavelength: '4.5e-7' } },
    { label: 'X-ray (0.1 nm)', values: { wavelength: '1e-10' } },
    { label: 'Gamma ray (0.001 nm)', values: { wavelength: '1e-12' } },
  ],
  compute: (v) => { const h = 6.626e-34; const E = h * v.frequency; const eV = E / 1.602e-19; return { result: E, label: 'Photon Energy', unit: 'J', steps: [{ label: 'Formula', value: 'E = hf = hc/λ' }, { label: 'Planck constant', value: '6.626×10⁻^3^4 J·s' }, { label: 'Energy in J', value: `${E.toExponential(4)} J` }, { label: 'Energy in eV', value: `${eV.toExponential(4)} eV` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Photon energy determines light color, photosynthesis efficiency, and medical imaging (X-rays need higher energy to penetrate tissue).' },
        { label: 'Common Values', value: 'Red (700 nm): 1.77 eV. Green (550 nm): 2.25 eV. Blue (450 nm): 2.76 eV. UV (100 nm): 12.4 eV. X-ray (0.1 nm): 12.4 keV.' },
        { label: 'Precision Tip', value: 'E = hf = hc/λ. h = 6.626×10⁻³⁴ J·s = 4.136×10⁻¹⁵ eV·s. hc = 1240 eV·nm. Short wavelength = high energy.' },
        { label: 'Related Formula', value: 'E = hf. Photoelectric effect: KE_max = hf - φ. Compton scattering: Δλ = h/(mc)(1 - cosθ). Momentum: p = h/λ.' },
        { label: 'Unit Conversion Note', value: '1 eV = 1.602×10⁻¹⁹ J. h = 6.626×10⁻³⁴ J·s. hc = 1240 eV·nm. Wavelength in m or nm. 1 nm = 10⁻⁹ m.' }
      ]} },
  description: 'Photon energy is proportional to frequency, with Planck\'s constant as the proportionality constant.',
  formula: 'E = hf',
  interpretation: 'Visible light photons have energies of ~1.65-3.1 eV. Higher frequency means higher energy. X-rays and gamma rays have the highest photon energies.'
}

export default calcDef
