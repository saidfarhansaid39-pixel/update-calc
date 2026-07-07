import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ht: z.string().refine(v => parseFloat(v) > 0, '>0'),
    hs: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'ht', label: 'Total Heterozygosity (HT)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'hs', label: 'Average Subpop Heterozygosity (HS)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => {
    const ht = v.ht; const hs = v.hs
    const fst = (ht - hs) / ht
    return {
      result: fst, label: 'Fixation Index (FST)', unit: '',
      steps: [
        { label: 'HT (total heterozygosity)', value: `${ht.toFixed(3)}` },
        { label: 'HS (subpopulation mean)', value: `${hs.toFixed(3)}` },
        { label: 'FST = (HT - HS) / HT', value: `${fst.toFixed(4)}` },
        { label: 'Interpretation', value: fst < 0.05 ? 'Low differentiation' : fst < 0.15 ? 'Moderate' : fst < 0.25 ? 'High' : 'Very high differentiation' },
      ]
}
  },
  description: 'FST (fixation index) measures population differentiation due to genetic structure. It ranges from 0 (no differentiation) to 1 (complete differentiation).',
  formula: 'FST = (HT - HS) / HT = 1 - (HS / HT) | HT = total expected heterozygosity, HS = mean subpopulation heterozygosity',
  interpretation: 'FST < 0.05: little differentiation. 0.05-0.15: moderate. 0.15-0.25: high. > 0.25: very high. Human populations typically have FST ˜ 0.05-0.15.'
}

export default calcDef
