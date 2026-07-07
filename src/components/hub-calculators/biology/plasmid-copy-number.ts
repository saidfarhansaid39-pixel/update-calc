import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    plasmidDna: z.string().refine(v => parseFloat(v) > 0, '>0'),
    plasmidSize: z.string().refine(v => parseInt(v) > 0, '>0'),
    genomeSize: z.string().refine(v => parseInt(v) > 0, '>0')
}),
  fields: [
    { name: 'plasmidDna', label: 'Plasmid DNA (ng) per µg genomic', type: 'number', min: 0.1, step: '0.1' },
    { name: 'plasmidSize', label: 'Plasmid Size (kb)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'genomeSize', label: 'Genome Size (kb)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const genomeMassRatio = (v.plasmidDna / 1000) / 1
    const sizeRatio = v.genomeSize / v.plasmidSize
    const copyNumPerCell = genomeMassRatio * sizeRatio
    return {
      result: copyNumPerCell, label: 'Plasmid Copies per Cell', unit: 'copies/cell',
      steps: [
        { label: 'Plasmid DNA/genomic DNA ratio', value: `${(genomeMassRatio).toFixed(4)}` },
        { label: 'Size correction (genome/plasmid)', value: `${sizeRatio.toFixed(1)}` },
        { label: 'Estimated copy number', value: `${copyNumPerCell.toFixed(0)} copies/cell` },
        { label: 'Copy number category', value: copyNumPerCell > 100 ? 'High copy' : copyNumPerCell > 20 ? 'Medium copy' : 'Low copy' },
      ]
}
  },
  description: 'Plasmid copy number is the number of plasmid molecules per bacterial cell. It depends on the origin of replication and affects gene expression levels.',
  formula: 'Copies/cell = (ng plasmid / ng genomic) × (genome size / plasmid size)',
  interpretation: 'pUC ori: 500-700 copies/cell. ColE1 (pBR322): 15-20. pSC101: ~5. Low copy is better for toxic genes or large inserts. High copy maximizes DNA yield.'
}

export default calcDef
