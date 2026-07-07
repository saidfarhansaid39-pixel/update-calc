import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rp: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'rp', label: 'Pressure Ratio r_p', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'gamma', label: 'Specific Heat Ratio γ', type: 'number', unit: '', min: 1.1, step: '0.01' }],
  compute: (v) => { const eff = 1 - 1 / Math.pow(v.rp, (v.gamma - 1) / v.gamma); return { result: eff, label: 'Brayton Cycle Efficiency η_brayton', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - 1/r_p^((γ-1)/γ)' }, { label: 'Result', value: `${(eff * 100).toFixed(1)}%` }] } },
  description: 'The Brayton cycle models the ideal gas turbine engine (jet engine, power plant). Efficiency depends on pressure ratio r_p and specific heat ratio γ.',
  formula: 'η = 1 - 1/r_p^((γ-1)/γ)',
  interpretation: 'Modern gas turbines use r_p ≈ 10-40 with γ ≈ 1.4 (air), giving η ≈ 48-65%. Real efficiency is lower (30-45%) due to compressor and turbine losses. Combined-cycle plants (Brayton + Rankine) reach 60%.'
}

export default calcDef
