import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    guideLen: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 17 && n <= 24 }, '17-24'),
    gcPct: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'guideLen', label: 'Guide RNA Length', type: 'number', unit: 'nt', min: 17, max: 24, step: '1' },
    { name: 'gcPct', label: 'GC Content', type: 'number', unit: '%', min: 0, max: 100, step: '1' },
  ],
  compute: (v) => {
    const gc = v.gcPct / 100 * v.guideLen
    const at = v.guideLen - gc
    const tm = 2 * at + 4 * gc
    const quality = v.gcPct >= 40 && v.gcPct <= 60 ? 'Optimal' : v.gcPct >= 20 && v.gcPct <= 80 ? 'Acceptable' : 'Suboptimal'
    return {
      result: tm, label: 'Guide Tm (approx)', unit: '°C',
      steps: [
        { label: 'Length', value: `${v.guideLen} nt` },
        { label: 'GC content', value: `${v.gcPct}%` },
        { label: 'G+C count', value: `${gc.toFixed(0)}` },
        { label: 'A+T count', value: `${at.toFixed(0)}` },
        { label: 'Tm = 2(AT) + 4(GC)', value: `${tm.toFixed(1)}°C` },
        { label: 'Quality', value: quality },
        { label: 'PAM requirement', value: "SpCas9: NGG at 3' end of target" },
      ]
}
  },
  description: 'CRISPR-Cas9 guide RNA design parameters. Optimal guides are 20 nt with 40-60% GC. Tm, length, and GC content predict on-target efficiency and specificity.',
  formula: 'Tm ˜ 2(AT) + 4(GC) | Optimal: 18-22 nt, GC 40-60%, no poly-T (RNA pol III terminator)',
  interpretation: 'Higher GC = higher Tm = more stable binding, but increased off-target potential. Guides < 18 nt lose specificity; > 24 nt increase off-target. Always check off-target scores with alignment tools.'
}

export default calcDef
