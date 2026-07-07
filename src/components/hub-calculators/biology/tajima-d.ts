import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    segSites: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    numSeqs: z.string().min(1, 'Required').refine(v => parseInt(v) > 2, '>2'),
    pi: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'segSites', label: 'Segregating Sites (S)', type: 'number', min: 1, step: '1' },
    { name: 'numSeqs', label: 'Number of Sequences (n)', type: 'number', min: 3, step: '1' },
    { name: 'pi', label: 'Nucleotide Diversity (p)', type: 'number', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const n = v.numSeqs
    const a1 = Array.from({length: n - 1}, (_, i) => 1 / (i + 1)).reduce((s, x) => s + x, 0)
    const a2 = Array.from({length: n - 1}, (_, i) => 1 / (i + 1) ** 2).reduce((s, x) => s + x, 0)
    const b1 = (n + 1) / (3 * (n - 1))
    const b2 = 2 * (n ** 2 + n + 3) / (9 * n * (n - 1))
    const c1 = b1 - 1 / a1
    const e1 = c1 / a1
    const thetaW = v.segSites / a1
    const d = (v.pi - thetaW) / Math.sqrt(e1 * v.segSites)
    return {
      result: d, label: 'Tajima\'s D', unit: '',
      steps: [
        { label: 'S (segregating sites)', value: `${v.segSites}` },
        { label: 'n (sequences)', value: `${n}` },
        { label: '?W = S/a1', value: `${thetaW.toFixed(4)}` },
        { label: 'p (nucleotide diversity)', value: `${v.pi.toFixed(4)}` },
        { label: 'D = (p - ?W) / vVar', value: `${d.toFixed(4)}` },
        { label: 'Interpretation', value: d > 2 ? 'Balancing selection / pop structure' : d < -2 ? 'Purifying sel. / bottleneck / expansion' : 'Neutral (null not rejected)' },
      ]
}
  },
  description: 'Tajima\'s D compares nucleotide diversity (p) with segregating site count (?W) to detect selection or demographic changes. D ˜ 0 under neutral equilibrium.',
  formula: 'D = (p - ?W) / vVar | ?W = S / S(1/i) for i = 1 to n-1 | D > 2: significant positive; D < -2: significant negative',
  interpretation: 'D > 0 shows excess intermediate-frequency alleles (balancing selection, population structure). D < 0 shows excess rare variants (purifying selection, recent expansion, bottleneck). D ˜ 0 expected under neutral equilibrium.'
}

export default calcDef
