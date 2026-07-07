import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 4 && n <= 1000 }, '4-1000'), blocks: z.string().min(1).refine(v => { const b = parseInt(v); return b >= 2 && b <= 8 }, '2-8') }),
  fields: [{ name: 'n', label: 'Total Subjects', type: 'number', min: 4, max: 1000, step: '2' }, { name: 'blocks', label: 'Block Size', type: 'number', min: 2, max: 8, step: '2' }],
  compute: (v) => { const total = Math.round(n(v.n)); const blockSize = Math.round(n(v.blocks)); const assign = (id: number) => id % 2 === 0 ? 'Treatment' : 'Control'; const list = Array.from({ length: total }, (_, i) => ({ id: i + 1, block: Math.ceil((i + 1) / blockSize), group: assign(i) })); const counts = { Treatment: Math.ceil(total / 2), Control: Math.floor(total / 2) }; return { result: `T:${counts.Treatment} C:${counts.Control}`, label: 'Allocation', unit: '', steps: [{ label: 'Blocks', value: `${Math.ceil(total / blockSize)}` }, { label: 'Block size', value: `${blockSize}` }, { label: 'Treatment', value: `${counts.Treatment}` }, { label: 'Control', value: `${counts.Control}` }] } },
  description: 'Generates a blocked randomization list to allocate subjects into treatment and control groups.',
  formula: 'Permuted block randomization: each block contains balanced allocations in random order.',
  interpretation: 'Blocked randomization ensures balanced group sizes throughout the trial. Block sizes should be blinded to prevent prediction of next assignment.'
}

export default calcDef
