import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const freq: Record<number, number> = {}; nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 }); const maxFreq = Math.max(...Object.values(freq), 0); const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([k]) => Number(k)); return { result: modes.join(', '), label: 'Mode(s)', unit: '', steps: [{ label: 'Values', value: nums.join(', ') }, { label: 'Mode(s)', value: modes.join(', ') || 'None (all unique)' }] } },
  description: 'The mode is the value that appears most frequently in a dataset.',
  formula: 'Mode = most frequent value',
  interpretation: 'A dataset can have no mode (all unique), one mode (unimodal), or multiple modes (bimodal, multimodal).'
}

export default calcDef
