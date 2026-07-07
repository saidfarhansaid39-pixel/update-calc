import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    bnCells: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    micronuclei: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'bnCells', label: 'Binucleated Cells Scored', type: 'number', min: 100, step: '100' },
    { name: 'micronuclei', label: 'Micronuclei Counted', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const freq = v.bnCells > 0 ? (v.micronuclei / v.bnCells) * 1000 : 0
    return {
      result: freq, label: 'Micronucleus Frequency', unit: 'per 1,000 BN cells',
      steps: [
        { label: 'Binucleated cells scored', value: `${v.bnCells.toLocaleString()}` },
        { label: 'Micronuclei observed', value: `${v.micronuclei}` },
        { label: 'Frequency = (MN / BN) × 1000', value: `${freq.toFixed(2)}‰` },
        { label: 'Control range', value: 'Spontaneous: 0-5‰ (varies by cell type and donor)' },
        { label: 'Cytokinesis-block (CBMN)', value: 'Cytochalasin B blocks cytokinesis — score only binucleated cells' },
      ]
}
  },
  description: 'The cytokinesis-block micronucleus (CBMN) assay measures chromosome damage. Micronuclei form from acentric chromosome fragments or whole chromosomes that lag during anaphase.',
  formula: 'MN frequency (‰) = (number of MN / number of BN cells) × 1000 | Score 500-2,000 binucleated cells per sample',
  interpretation: 'Elevated MN frequency indicates genotoxic exposure or chromosomal instability. Normal: 0-5‰; moderate: 5-20‰; high: >20‰. Also score: nucleoplasmic bridges (NPBs) and nuclear buds (NBUDs) for comprehensive assessment.'
}

export default calcDef
