import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const freq: Record<string, number> = {}; nums.forEach(x => { const k = `${x}`; freq[k] = (freq[k] || 0) + 1 }); const entries = Object.entries(freq).sort(([a], [b]) => parseFloat(a) - parseFloat(b)); const total = nums.length; return { result: entries.map(([k, f]) => `${k}:${f}`).join(', '), label: 'Frequency Distribution', unit: '', steps: [{ label: 'Total', value: `${total}` }, { label: 'Classes', value: `${entries.length}` }, { label: 'Distribution', value: entries.map(([k, f]) => `${k}(${f})`).join(', ') }] } },
  description: 'A frequency distribution shows how often each distinct value occurs in a dataset. It is the foundation of descriptive statistics.',
  formula: 'fᵢ = count of xᵢ values, relative f = fᵢ/n',
  interpretation: 'Frequency distributions reveal patterns: which values are most common, the spread of data, and potential outliers.'
}

export default calcDef
