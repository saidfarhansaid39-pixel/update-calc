import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const total = nums.length; const freq: Record<string, number> = {}; nums.forEach(x => { const k = `${x}`; freq[k] = (freq[k] || 0) + 1 }); const entries = Object.entries(freq).sort(([a], [b]) => parseFloat(a) - parseFloat(b)); let cum = 0; const cumEntries = entries.map(([k, f]) => { cum += f; return `${k}:${cum}(${(cum / total * 100).toFixed(1)}%)` }); return { result: cumEntries.join(', '), label: 'Cumulative Frequency', unit: '', steps: [{ label: 'Total', value: `${total}` }, { label: 'Final cumulative', value: `${cum} (${(cum / total * 100).toFixed(1)}%)` }] } },
  description: 'Cumulative frequency is the running total of frequencies up to each value or class. It shows how many observations fall at or below a value.',
  formula: 'CF(x) = Σ fᵢ for xᵢ ≤ x',
  interpretation: 'The cumulative frequency at the maximum value equals the total sample size. The ogive curve plots cumulative frequencies.'
}

export default calcDef
