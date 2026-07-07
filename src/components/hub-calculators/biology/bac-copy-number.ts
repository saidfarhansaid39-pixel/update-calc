import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    plasmidDnaNg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    plasmidKb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    genomeKb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'plasmidDnaNg', label: 'Plasmid DNA (ng) per µg genomic', type: 'number', min: 0.1, step: '0.1' },
    { name: 'plasmidKb', label: 'Plasmid Size', type: 'number', unit: 'kb', min: 0.1, step: '0.1' },
    { name: 'genomeKb', label: 'Genome Size', type: 'number', unit: 'kb', min: 1, step: '1' },
  ],
  compute: (v) => {
    const ratio = (v.plasmidDnaNg / 1000) / 1
    const sizeRatio = v.genomeKb / v.plasmidKb
    const copies = ratio * sizeRatio
    return {
      result: copies, label: 'Plasmid Copies per Cell', unit: 'copies/cell',
      steps: [
        { label: 'Plasmid/genomic DNA ratio', value: `${ratio.toExponential(4)}` },
        { label: 'Size correction (genome/plasmid)', value: `${sizeRatio.toFixed(1)}` },
        { label: 'Copy number = ratio × size ratio', value: `${copies.toFixed(0)}` },
        { label: 'Category', value: copies > 100 ? 'High copy' : copies > 20 ? 'Medium copy' : 'Low copy' },
      ]
}
  },
  description: 'Plasmid copy number is the number of plasmid molecules per bacterial cell. It depends on the origin of replication and affects gene expression and DNA yield.',
  formula: 'Copies/cell = (ng plasmid / ng genomic) × (genome size / plasmid size) | pUC ori: 500-700, ColE1: 15-20, pSC101: ~5',
  interpretation: 'High copy: pUC/MB1-derived (500-700/cell). Medium: pBR322/ColE1 (15-20). Low: pSC101 (5). Low copy preferred for toxic genes/large inserts. High copy maximizes purification yield.'
}

export default calcDef
