import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const total = nums.length; const freq: Record<string, number> = {}; nums.forEach(x => { const k = `${x}`; freq[k] = (freq[k] || 0) + 1 }); const entries = Object.entries(freq).sort(([a], [b]) => parseFloat(a) - parseFloat(b)); const rel = entries.map(([k, f]) => `${k}:${(f / total * 100).toFixed(1)}%`); return { result: rel.join(', '), label: 'Relative Frequencies', unit: '%', steps: [{ label: 'Total', value: `${total}` }, { label: 'Distribution', value: rel.join(', ') }] } },
  description: 'Relative frequency expresses each class frequency as a proportion or percentage of the total. It facilitates comparison across datasets.',
  formula: 'rfᵢ = fᵢ / n, as percentage = rfᵢ × 100%',
  interpretation: 'Relative frequencies always sum to 1 (or 100%). They are useful for comparing distributions with different sample sizes.'
}

export default calcDef
