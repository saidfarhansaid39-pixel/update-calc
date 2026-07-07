import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ means: z.string().min(1, 'Required'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), mse: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'means', label: 'Group Means (comma separated)', type: 'number', step: 'any' }, { name: 'n', label: 'N per group', type: 'number', min: 2, step: '1' }, { name: 'mse', label: 'MSE (within groups)', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const means = parseList(v.means); const nPer = Math.round(n(v.n)); const mse = n(v.mse); if (means.length < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const se = Math.sqrt(mse / nPer); const qs = []; for (let i = 0; i < means.length; i++) { for (let j = i + 1; j < means.length; j++) { const diff = Math.abs(means[i] - means[j]); const q = se > 0 ? diff / se : 0; qs.push({ pair: `${i + 1}-${j + 1}`, diff: diff.toFixed(4), q: q.toFixed(4) }) } }; return { result: qs.map(q => `${q.pair}:${q.q}`).join('; '), label: 'Tukey HSD Q Stats', unit: '', steps: [{ label: 'Groups', value: `${means.length}` }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 'Comparisons', value: qs.map(q => `${q.pair} q=${q.q}`).join(', ') }] } },
  description: 'Tukey\'s Honestly Significant Difference (HSD) test performs all pairwise comparisons controlling familywise error rate.',
  formula: 'q = |x̄ᵢ - x̄ⱼ| / √(MSE/n), critical q from studentized range distribution',
  interpretation: 'If observed q exceeds critical q, the pair is significantly different. Controls FWER at α for all pairwise comparisons.'
}

export default calcDef
