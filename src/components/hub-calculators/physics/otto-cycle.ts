import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'r', label: 'Compression Ratio r', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'gamma', label: 'Specific Heat Ratio γ', type: 'number', unit: '', min: 1.1, step: '0.01' }],
  compute: (v) => { const eff = 1 - 1 / Math.pow(v.r, v.gamma - 1); return { result: eff, label: 'Otto Cycle Efficiency η_otto', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - 1/r^(γ-1)' }, { label: 'Result', value: `${(eff * 100).toFixed(1)}%` }] } },
  description: 'The Otto cycle models the ideal gasoline engine. Efficiency depends on compression ratio r and specific heat ratio γ of the working fluid.',
  formula: 'η = 1 - 1/r^(γ-1)',
  interpretation: 'Typical modern gasoline engines have r ≈ 8-12 with γ ≈ 1.4 for air, giving η ≈ 56-63%. Real efficiency is lower due to friction, heat loss, and incomplete combustion. Higher r causes knocking (pre-ignition).'
}

export default calcDef
