import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    source: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    target: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    levels: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'source', label: 'Energy at Lower Level', type: 'number', unit: 'kJ/m²/yr', min: 1, step: '1' },
    { name: 'target', label: 'Energy at Higher Level', type: 'number', unit: 'kJ/m²/yr', min: 0.1, step: '1' },
    { name: 'levels', label: 'Number of Transfers (optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const efficiency = v.source > 0 ? v.target / v.source * 100 : 0
    const levels = v.levels || 1
    const remaining = v.source * (efficiency / 100) ** levels
    return {
      result: efficiency, label: 'Transfer Efficiency', unit: '%',
      steps: [
        { label: 'Energy at level N', value: `${v.source} kJ/m²/yr` },
        { label: 'Energy at level N+1', value: `${v.target} kJ/m²/yr` },
        { label: 'Efficiency', value: `${efficiency.toFixed(1)}%` },
        ...(levels > 1 ? [
          { label: 'After {levels} transfers', value: `${remaining.toFixed(1)} kJ/m²/yr` },
          { label: `Fraction of original`, value: `${(remaining / v.source * 100).toFixed(2)}%` },
        ] : []),
        { label: '10% rule comparison', value: `${(v.source * 0.1 ** levels).toFixed(1)} kJ (if 10% efficient)` },
      ]
}
  },
  description: 'Energy transfer efficiency measures how much energy moves from one trophic level to the next. Typical efficiency is 5-20% (Lindeman\'s trophic dynamics).',
  formula: 'Efficiency = (Energy_N+1 / Energy_N) × 100% | After n transfers: E₀ × (efficiency)^n',
  interpretation: 'If 10% efficient: 1,000,000 J → 100,000 J → 10,000 J → 1,000 J → 100 J. This limits food chain length and explains why top predators are rare.'
}

export default calcDef
