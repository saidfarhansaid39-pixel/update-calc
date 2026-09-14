import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ parentZ: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 118 }, '1-118'), parentA: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 300 }, '1-300') }),
  fields: [{ name: 'parentZ', label: 'Parent Z', type: 'number', unit: '', min: 1, max: 118, step: '1' }, { name: 'parentA', label: 'Parent A', type: 'number', unit: '', min: 1, max: 300, step: '1' }],
  defaults: { halfLife: '5730', time: '1000', initial: '100' },
  presets: [
    { label: 'Carbon-14 (5730 year half-life)', values: { halfLife: '5730', time: '1000', initial: '100' } },
    { label: 'Uranium-238 (4.47 Ga half-life)', values: { halfLife: '4.47e9', time: '1e9', initial: '100' } },
    { label: 'Iodine-131 (8.02 days)', values: { halfLife: '8.02', time: '16.04', initial: '100' } },
  ],
  compute: (v) => { const mAlpha = 4.002603; const Z = v.parentZ; const A = v.parentA; const mDaughter = A - 4; const Q = (A - mDaughter - mAlpha) * 931.5; return { result: Q > 0 ? Q.toFixed(2) : 'Not possible', label: 'Decay Energy Q', unit: 'MeV', steps: [{ label: 'Formula', value: 'Q = (m_parent - m_daughter - m_α)c²' }, { label: 'Daughter', value: `Z-2 = ${Z - 2}, A-4 = ${A - 4}` }, { label: 'Energy', value: Q > 0 ? `${Q.toFixed(2)} MeV` : 'Decay not energetically possible' }] ,
    extras: [
        { label: 'Real-World Application', value: 'Radioactive decay enables radiometric dating (carbon-14 for archaeology, uranium-lead for geology) and medical imaging (technetium-99m, half-life 6 h).' },
        { label: 'Common Values', value: 'C-14: 5730 yr. U-238: 4.47×10⁹ yr. I-131: 8.02 days. Tc-99m: 6.01 h. Rn-222: 3.82 days. Po-210: 138 days.' },
        { label: 'Precision Tip', value: 'N = N₀(½)^(t/t_½). Decay constant λ = ln(2)/t_½. Activity A = λN. One half-life reduces activity by 50%.' },
        { label: 'Related Formula', value: 'N = N₀e^(-λt). t_½ = ln(2)/λ. Mean lifetime τ = 1/λ. Activity: A = λN = A₀e^(-λt). Carbon dating: t = (1/λ)ln(N₀/N).' },
        { label: 'Unit Conversion Note', value: 'Half-life and time in same units. Decay constant λ in 1/time. Activity in Bq (decays/s) or Ci (3.7×10¹⁰ Bq).' }
      ]} },
  description: 'Alpha decay emits a helium-4 nucleus (2 protons, 2 neutrons). The Q-value determines if decay is energetically possible. Most alpha emitters have A > 210.',
  formula: 'Q = (m_parent - m_daughter - m_α)c²',
  interpretation: 'Alpha decay reduces atomic number by 2 and mass number by 4. Example: ²³⁸U → ²³⁴Th + α. The emitted alpha particle has kinetic energy typically 4-9 MeV. Alpha particles are heavily ionizing but short-ranged.'
}

export default calcDef
