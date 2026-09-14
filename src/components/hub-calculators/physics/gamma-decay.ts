import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ei: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ef: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'ei', label: 'Initial Nuclear Energy Eᵢ', type: 'number', unit: 'MeV', min: 0.01, step: '0.01' }, { name: 'ef', label: 'Final Nuclear Energy Eƒ', type: 'number', unit: 'MeV', min: 0, step: '0.01' }],
  defaults: { halfLife: '5730', time: '1000', initial: '100' },
  presets: [
    { label: 'Carbon-14 (5730 year half-life)', values: { halfLife: '5730', time: '1000', initial: '100' } },
    { label: 'Uranium-238 (4.47 Ga half-life)', values: { halfLife: '4.47e9', time: '1e9', initial: '100' } },
    { label: 'Iodine-131 (8.02 days)', values: { halfLife: '8.02', time: '16.04', initial: '100' } },
  ],
  compute: (v) => { const E_gamma = v.ei - v.ef; const lambda = 1.24e-12 / (E_gamma * 1.602e-13); const wavelength = 1.24e-12 / E_gamma; return { result: E_gamma, label: 'Gamma Photon Energy', unit: 'MeV', steps: [{ label: 'Formula', value: 'E_γ = Eᵢ - Eƒ' }, { label: 'Energy', value: `${E_gamma.toFixed(4)} MeV` }, { label: 'Wavelength', value: `${(wavelength * 1e12).toFixed(2)} pm` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Radioactive decay enables radiometric dating (carbon-14 for archaeology, uranium-lead for geology) and medical imaging (technetium-99m, half-life 6 h).' },
        { label: 'Common Values', value: 'C-14: 5730 yr. U-238: 4.47×10⁹ yr. I-131: 8.02 days. Tc-99m: 6.01 h. Rn-222: 3.82 days. Po-210: 138 days.' },
        { label: 'Precision Tip', value: 'N = N₀(½)^(t/t_½). Decay constant λ = ln(2)/t_½. Activity A = λN. One half-life reduces activity by 50%.' },
        { label: 'Related Formula', value: 'N = N₀e^(-λt). t_½ = ln(2)/λ. Mean lifetime τ = 1/λ. Activity: A = λN = A₀e^(-λt). Carbon dating: t = (1/λ)ln(N₀/N).' },
        { label: 'Unit Conversion Note', value: 'Half-life and time in same units. Decay constant λ in 1/time. Activity in Bq (decays/s) or Ci (3.7×10¹⁰ Bq).' }
      ]} },
  description: 'Gamma decay occurs when an excited nucleus transitions to a lower energy state by emitting a high-energy photon (gamma ray).',
  formula: 'E_γ = Eᵢ - Eƒ',
  interpretation: 'Gamma rays have energies from keV to MeV, with wavelengths < 10 pm. They are highly penetrating. Gamma spectroscopy identifies nuclear energy levels. Cobalt-60 emits 1.17 and 1.33 MeV gammas.'
}

export default calcDef
