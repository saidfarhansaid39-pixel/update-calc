import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), rc: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'r', label: 'Compression Ratio r', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'rc', label: 'Cutoff Ratio r_c', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'gamma', label: 'Specific Heat Ratio γ', type: 'number', unit: '', min: 1.1, step: '0.01' }],
  compute: (v) => { const invR = Math.pow(v.r, -(v.gamma - 1)); const eff = 1 - invR * (Math.pow(v.rc, v.gamma) - 1) / (v.gamma * (v.rc - 1)); return { result: eff, label: 'Diesel Cycle Efficiency η_diesel', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - (1/r^(γ-1))·(r_c^γ-1)/(γ(r_c-1))' }, { label: 'Result', value: `${(eff * 100).toFixed(1)}%` }] } },
  description: 'The Diesel cycle models the ideal compression-ignition engine. Unlike the Otto cycle, heat is added at constant pressure, not constant volume.',
  formula: 'η = 1 - (1/r^(γ-1))·(r_c^γ-1)/(γ(r_c-1))',
  interpretation: 'Diesel engines have higher compression ratios (r ≈ 14-25) than gasoline engines, giving higher efficiency. Typical η ≈ 50-60% for ideal cycle. The cutoff ratio r_c = V₃/V₂ describes the constant-pressure combustion phase.'
}

export default calcDef
