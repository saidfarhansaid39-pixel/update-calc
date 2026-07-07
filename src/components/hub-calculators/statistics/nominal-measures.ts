import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, nominal categories)', type: 'number', step: 'any' }],
  compute: (v) => { const items = (v.values || '').split(',').map((x: string) => x.trim()).filter((x: string) => x !== ''); const freq: Record<string, number> = {}; items.forEach((x: string) => { freq[x] = (freq[x] || 0) + 1 }); const total = items.length; const maxFreq = Math.max(...Object.values(freq), 0); const mode = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([k]) => k); const proportions = Object.entries(freq).map(([k, f]) => `${k}:${(f / total * 100).toFixed(1)}%`); return { result: mode.join(', '), label: 'Mode', unit: '', steps: [{ label: 'Total items', value: `${total}` }, { label: 'Unique categories', value: `${Object.keys(freq).length}` }, { label: 'Mode(s)', value: mode.join(', ') || 'None (all unique)' }, { label: 'Proportions', value: proportions.join(', ') }] } },
  description: 'Nominal measures describe categorical data without inherent order. Mode is the only measure of central tendency for nominal data.',
  formula: 'Mode = most frequent category, proportion = fᵢ/n',
  interpretation: 'The mode identifies the most common category. Bar charts and pie charts visualize nominal data distributions.'
}

export default calcDef
