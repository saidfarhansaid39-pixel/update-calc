import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cValue: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'cValue', label: 'C-value (pg DNA per haploid genome)', type: 'number', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const bp = v.cValue * 0.978e9
    return {
      result: bp / 1e9, label: 'Genome Size', unit: 'Gb',
      steps: [
        { label: 'C-value', value: `${v.cValue} pg` },
        { label: 'Conversion (1 pg = 0.978 × 10? bp)', value: '' },
        { label: 'Genome size = C × 0.978 × 10?', value: `${bp.toFixed(0)} bp` },
        { label: 'In Mb', value: `${(bp / 1e6).toFixed(1)} Mb` },
        { label: 'In Gb', value: `${(bp / 1e9).toFixed(3)} Gb` },
      ]
}
  },
  description: 'Convert genome C-value (picograms of DNA per haploid genome) to base pairs. The C-value varies enormously across species and does not correlate with organism complexity.',
  formula: '1 pg DNA = 0.978 × 10? bp | Human: 3.2 Gb (3.2 pg) | C-value paradox: genome size ? complexity (mostly repetitive DNA)',
  interpretation: 'Human: ~3.2 Gb. E. coli: 4.6 Mb. Largest: Paris japonica (150 Gb). Most of the variation is due to repetitive elements (transposons, satellites). C-value does not predict gene number.'
}

export default calcDef
