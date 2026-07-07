import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    gCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    cCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    aCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    tCount: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'gCount', label: 'G Bases', type: 'number', min: 0, step: '1' },
    { name: 'cCount', label: 'C Bases', type: 'number', min: 0, step: '1' },
    { name: 'aCount', label: 'A Bases', type: 'number', min: 0, step: '1' },
    { name: 'tCount', label: 'T Bases', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const total = v.gCount + v.cCount + v.aCount + v.tCount
    const gcPct = total > 0 ? ((v.gCount + v.cCount) / total) * 100 : 0
    return {
      result: gcPct, label: 'GC Content', unit: '%',
      steps: [
        { label: 'G', value: `${v.gCount}` },
        { label: 'C', value: `${v.cCount}` },
        { label: 'A', value: `${v.aCount}` },
        { label: 'T', value: `${v.tCount}` },
        { label: 'Total bases', value: `${total}` },
        { label: 'GC% = (G+C)/total × 100', value: `${gcPct.toFixed(1)}%` },
      ]
}
  },
  description: 'GC content of primers and amplicons affects melting temperature and PCR efficiency. Optimal primer GC content is typically 40-60%.',
  formula: 'GC% = (G + C) / (A + T + G + C) × 100%',
  interpretation: 'Too low GC (<30%): weak binding, low Tm. Too high GC (>70%): may form stable secondary structures. Optimal range: 40-60%. Primers with similar GC% have compatible Tms for multiplexing.'
}

export default calcDef
