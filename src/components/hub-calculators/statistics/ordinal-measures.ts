import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, ordinal)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const mid = Math.floor(nums.length / 2); const median = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid]; const freq: Record<number, number> = {}; nums.forEach(x => { freq[x] = (freq[x] || 0) + 1 }); const maxFreq = Math.max(...Object.values(freq), 0); const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([k]) => Number(k)); return { result: `Median:${median} Mode:${modes.join(',')}`, label: 'Ordinal Measures', unit: '', steps: [{ label: 'Median', value: `${median.toFixed(4)}` }, { label: 'Mode(s)', value: modes.join(', ') || 'None' }, { label: 'Count', value: `${nums.length}` }] } },
  description: 'Ordinal measures are statistics appropriate for ordinal (ranked) data. Median and mode are valid; mean is not.',
  formula: 'Median = middle value, Mode = most frequent',
  interpretation: 'For ordinal data, median is preferred over mean because distances between ranks are not necessarily equal.'
}

export default calcDef
