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
  compute: (v) => { const a_A = 23.21; const a_P = 12.0; const A = v.parentA; const Z = v.parentZ; const N = A - Z; const delta_m = 0.782; const asym_term = (Z % 2 === 0 && N % 2 === 0) ? a_P / Math.sqrt(A) : ((Z % 2 === 1 && N % 2 === 1) ? -a_P / Math.sqrt(A) : 0); const Q_bm = delta_m + a_A * (4 / A) * (N - Z - 1) + 2 * asym_term; const Q_bp = -delta_m + a_A * (4 / A) * (N - Z + 1) - 2 * asym_term; return { result: Math.max(0, Q_bm), label: 'Approx. Q-value (β⁻)', unit: 'MeV', steps: [{ label: 'β⁻ process', value: `${Z} → ${Z + 1} (n→p)` }, { label: 'Q(β⁻)', value: `${Q_bm.toFixed(3)} MeV` }, { label: 'Q(β⁺)', value: `${Q_bp.toFixed(3)} MeV` }, { label: 'Note', value: 'Rough SEMF estimate; actual Q depends on precise masses.' }] ,
    extras: [
        { label: 'Real-World Application', value: 'Radioactive decay enables radiometric dating (carbon-14 for archaeology, uranium-lead for geology) and medical imaging (technetium-99m, half-life 6 h).' },
        { label: 'Common Values', value: 'C-14: 5730 yr. U-238: 4.47×10⁹ yr. I-131: 8.02 days. Tc-99m: 6.01 h. Rn-222: 3.82 days. Po-210: 138 days.' },
        { label: 'Precision Tip', value: 'N = N₀(½)^(t/t_½). Decay constant λ = ln(2)/t_½. Activity A = λN. One half-life reduces activity by 50%.' },
        { label: 'Related Formula', value: 'N = N₀e^(-λt). t_½ = ln(2)/λ. Mean lifetime τ = 1/λ. Activity: A = λN = A₀e^(-λt). Carbon dating: t = (1/λ)ln(N₀/N).' },
        { label: 'Unit Conversion Note', value: 'Half-life and time in same units. Decay constant λ in 1/time. Activity in Bq (decays/s) or Ci (3.7×10¹⁰ Bq).' }
      ]} },
  description: 'Beta decay: β⁻ decay converts a neutron to a proton (emitting e⁻ + ν̄ₑ), β⁺ decay converts a proton to a neutron (emitting e⁺ + νₑ).',
  formula: 'n → p + e⁻ + ν̄ₑ (β⁻), p → n + e⁺ + νₑ (β⁺)',
  interpretation: 'Beta decay occurs when the neutron-proton ratio is unfavorable for stability. The emitted electron/positron has a continuous energy spectrum due to the neutrino sharing the energy.'
}

export default calcDef
