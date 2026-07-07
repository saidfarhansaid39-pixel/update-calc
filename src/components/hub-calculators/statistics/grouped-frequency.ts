import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), bins: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 2 && n <= 50 }, '2-50') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'bins', label: 'Number of Bins', type: 'number', min: 2, max: 50, step: '1' }],
  compute: (v) => { const nums = parseList(v.values); const b = Math.round(n(v.bins)); if (nums.length === 0 || b < 2) return { result: 0, label: 'Grouped Frequency', unit: '', steps: [] }; const min = Math.min(...nums); const max = Math.max(...nums); const width = (max - min) / b; const bins: { start: number; end: number; count: number }[] = []; for (let i = 0; i < b; i++) { bins.push({ start: min + i * width, end: min + (i + 1) * width, count: 0 }) }; nums.forEach(x => { const idx = Math.min(Math.floor((x - min) / width), b - 1); bins[idx].count++ }); const result = bins.map(bin => `${bin.start.toFixed(2)}-${bin.end.toFixed(2)}:${bin.count}`).join(', '); return { result, label: 'Grouped Frequencies', unit: '', steps: [{ label: 'Min/Max', value: `${min.toFixed(2)} / ${max.toFixed(2)}` }, { label: 'Bin width', value: `${width.toFixed(4)}` }, { label: 'Bins', value: result }] } },
  description: 'Grouped frequency distribution organizes continuous data into intervals (bins) to reveal the underlying distribution shape.',
  formula: 'Bin i: [min + i×w, min + (i+1)×w), w = (max-min)/k',
  interpretation: 'The choice of bin count significantly affects the appearance of the distribution. Sturges\' rule suggests k ≈ 1 + log₂(n).'
}

export default calcDef
