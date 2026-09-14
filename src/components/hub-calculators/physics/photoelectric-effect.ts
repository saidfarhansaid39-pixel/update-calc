import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), workFunction: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Photon Frequency', type: 'number', unit: 'Hz', min: 1e14, step: '1e14' }, { name: 'workFunction', label: 'Work Function', type: 'number', unit: 'eV', min: 1, step: '0.1' }],
  defaults: { workFunction: '2.28', wavelength: '4e-7' },
  presets: [
    { label: 'Sodium (φ=2.28 eV, 400 nm)', values: { workFunction: '2.28', wavelength: '4e-7' } },
    { label: 'Cesium (φ=1.95 eV, 500 nm)', values: { workFunction: '1.95', wavelength: '5e-7' } },
    { label: 'Nickel (φ=5.01 eV, 200 nm)', values: { workFunction: '5.01', wavelength: '2e-7' } },
  ],
  compute: (v) => { const h = 6.626e-34; const e = 1.602e-19; const E = h * v.frequency; const E_eV = E / e; const K = E_eV - v.workFunction; const f0 = v.workFunction * e / h; return { result: K > 0 ? K : 0, label: 'Max Kinetic Energy', unit: 'eV', steps: [{ label: 'Formula', value: 'K_max = hf - φ' }, { label: 'Photon energy', value: `${E_eV.toExponential(4)} eV` }, { label: 'Kinetic energy', value: K > 0 ? `${K.toExponential(4)} eV` : 'None (below threshold)' }, { label: 'Threshold frequency', value: `${f0.toExponential(4)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'The photoelectric effect proved light quantization (Einstein, 1905 Nobel Prize). Used in solar panels, photomultipliers, and night vision.' },
        { label: 'Common Values', value: 'Cesium: φ=1.95 eV. Sodium: φ=2.28 eV. Calcium: φ=2.87 eV. Copper: φ=4.48 eV. Nickel: φ=5.01 eV. Threshold λ = hc/φ.' },
        { label: 'Precision Tip', value: 'KE_max = hf - φ. If f < f_threshold (φ/h), no electrons emitted. Einstein\'s equation: KE_max = hf - φ. Stopping potential: eV_s = KE_max.' },
        { label: 'Related Formula', value: 'E = hf = hc/λ. φ = hf_threshold. Stopping potential: V_s = (hf - φ)/e. Compton effect: Δλ = h/(mc)(1 - cosθ).' },
        { label: 'Unit Conversion Note', value: 'φ in eV. 1 eV = 1.602×10⁻¹⁹ J. h = 4.136×10⁻¹⁵ eV·s. hc = 1240 eV·nm. Threshold: λ₀ = hc/φ.' }
      ]} },
  description: 'The photoelectric effect: photons eject electrons from a material if their energy exceeds the work function. Einstein explained this using light quanta.',
  formula: 'K_max = hf - φ',
  interpretation: 'φ is the work function (binding energy). Below threshold frequency f₀ = φ/h, no electrons are emitted. The effect demonstrates the particle nature of light. Used in photodetectors and solar cells.'
}

export default calcDef
