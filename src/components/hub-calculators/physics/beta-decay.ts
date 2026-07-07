import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ parentZ: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 118 }, '1-118'), parentA: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 300 }, '1-300') }),
  fields: [{ name: 'parentZ', label: 'Parent Z', type: 'number', unit: '', min: 1, max: 118, step: '1' }, { name: 'parentA', label: 'Parent A', type: 'number', unit: '', min: 1, max: 300, step: '1' }],
  compute: (v) => { const a_A = 23.21; const a_P = 12.0; const A = v.parentA; const Z = v.parentZ; const N = A - Z; const delta_m = 0.782; const asym_term = (Z % 2 === 0 && N % 2 === 0) ? a_P / Math.sqrt(A) : ((Z % 2 === 1 && N % 2 === 1) ? -a_P / Math.sqrt(A) : 0); const Q_bm = delta_m + a_A * (4 / A) * (N - Z - 1) + 2 * asym_term; const Q_bp = -delta_m + a_A * (4 / A) * (N - Z + 1) - 2 * asym_term; return { result: Math.max(0, Q_bm), label: 'Approx. Q-value (β⁻)', unit: 'MeV', steps: [{ label: 'β⁻ process', value: `${Z} → ${Z + 1} (n→p)` }, { label: 'Q(β⁻)', value: `${Q_bm.toFixed(3)} MeV` }, { label: 'Q(β⁺)', value: `${Q_bp.toFixed(3)} MeV` }, { label: 'Note', value: 'Rough SEMF estimate; actual Q depends on precise masses.' }] } },
  description: 'Beta decay: β⁻ decay converts a neutron to a proton (emitting e⁻ + ν̄ₑ), β⁺ decay converts a proton to a neutron (emitting e⁺ + νₑ).',
  formula: 'n → p + e⁻ + ν̄ₑ (β⁻), p → n + e⁺ + νₑ (β⁺)',
  interpretation: 'Beta decay occurs when the neutron-proton ratio is unfavorable for stability. The emitted electron/positron has a continuous energy spectrum due to the neutrino sharing the energy.'
}

export default calcDef
