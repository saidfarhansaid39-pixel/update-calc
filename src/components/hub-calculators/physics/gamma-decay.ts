import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ei: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ef: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'ei', label: 'Initial Nuclear Energy Eᵢ', type: 'number', unit: 'MeV', min: 0.01, step: '0.01' }, { name: 'ef', label: 'Final Nuclear Energy Eƒ', type: 'number', unit: 'MeV', min: 0, step: '0.01' }],
  compute: (v) => { const E_gamma = v.ei - v.ef; const lambda = 1.24e-12 / (E_gamma * 1.602e-13); const wavelength = 1.24e-12 / E_gamma; return { result: E_gamma, label: 'Gamma Photon Energy', unit: 'MeV', steps: [{ label: 'Formula', value: 'E_γ = Eᵢ - Eƒ' }, { label: 'Energy', value: `${E_gamma.toFixed(4)} MeV` }, { label: 'Wavelength', value: `${(wavelength * 1e12).toFixed(2)} pm` }] } },
  description: 'Gamma decay occurs when an excited nucleus transitions to a lower energy state by emitting a high-energy photon (gamma ray).',
  formula: 'E_γ = Eᵢ - Eƒ',
  interpretation: 'Gamma rays have energies from keV to MeV, with wavelengths < 10 pm. They are highly penetrating. Gamma spectroscopy identifies nuclear energy levels. Cobalt-60 emits 1.17 and 1.33 MeV gammas.'
}

export default calcDef
