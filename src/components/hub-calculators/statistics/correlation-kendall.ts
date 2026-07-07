import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; let concordant = 0; let discordant = 0; for (let i = 0; i < x.length; i++) { for (let j = i + 1; j < x.length; j++) { const dx = x[i] - x[j]; const dy = y[i] - y[j]; if (dx * dy > 0) concordant++; else if (dx * dy < 0) discordant++ } }; const tau = (concordant - discordant) / (concordant + discordant); return { result: tau, label: 'Kendall τ', unit: '', steps: [{ label: 'N pairs', value: `${x.length}` }, { label: 'Concordant', value: `${concordant}` }, { label: 'Discordant', value: `${discordant}` }, { label: 'τ', value: `${tau.toFixed(4)}` }] } },
  description: 'Kendall\'s tau (τ) measures ordinal association based on concordant and discordant pairs. It is a non-parametric correlation.',
  formula: 'τ = (C - D) / (C + D)',
  interpretation: 'τ ranges from -1 to +1. Kendall\'s τ is more robust and interpretable as a probability than Spearman\'s ρ for small samples.'
}

export default calcDef
