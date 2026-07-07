import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const sorted = [...nums].sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]; const freq: Record<number, number> = {}; nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 }); const maxFreq = Math.max(...Object.values(freq), 0); const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([k]) => Number(k)); return { result: `Mean:${mean.toFixed(4)} Median:${median.toFixed(4)} Mode:${modes.join(',')}`, label: 'Central Tendency', unit: '', steps: [{ label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Median', value: `${median.toFixed(4)}` }, { label: 'Mode(s)', value: modes.join(', ') || 'None' }] } },
  description: 'Central tendency measures describe the center of a dataset: mean (average), median (middle), and mode (most frequent).',
  formula: 'x̄ = Σxᵢ/n, Median = Q₂, Mode = most frequent',
  interpretation: 'For symmetric distributions, mean ≈ median. For skewed data, median is more representative. Mode is useful for categorical data.'
}

export default calcDef
