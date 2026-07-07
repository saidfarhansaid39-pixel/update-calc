import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cdsBp: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    utr5: z.string().optional().refine(v => !v || parseInt(v) >= 0, '>=0'),
    utr3: z.string().optional().refine(v => !v || parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'cdsBp', label: 'CDS Length', type: 'number', unit: 'bp', min: 1, step: '1' },
    { name: 'utr5', label: "5' UTR Length (optional)", type: 'number', unit: 'bp', min: 0, step: '1' },
    { name: 'utr3', label: "3' UTR Length (optional)", type: 'number', unit: 'bp', min: 0, step: '1' },
  ],
  compute: (v) => {
    const u5 = v.utr5 || 100
    const u3 = v.utr3 || 400
    const totalMRNA = v.cdsBp + u5 + u3
    return {
      result: totalMRNA, label: 'Transcript Length (mRNA)', unit: 'bp',
      steps: [
        { label: 'CDS length', value: `${v.cdsBp} bp (${(v.cdsBp / 3).toFixed(0)} codons)` },
        { label: "5' UTR", value: `${u5} bp` },
        { label: "3' UTR", value: `${u3} bp` },
        { label: 'Poly(A) tail (est.)', value: '~200 A\'s' },
        { label: 'Total mature mRNA', value: `${totalMRNA.toLocaleString()} bp (${(totalMRNA / 1000).toFixed(1)} kb)` },
      ]
}
  },
  description: "Transcript length is the total mRNA sequence including CDS plus 5' and 3' untranslated regions (UTRs). UTRs contain regulatory elements affecting translation, stability, and localization.",
  formula: "mRNA length = CDS + 5'UTR + 3'UTR + poly(A) | Human median: ~2.5 kb (CDS ~1.3 kb, 5'UTR ~150 bp, 3'UTR ~700 bp)",
  interpretation: "Long 3' UTRs contain more miRNA binding sites (greater regulatory complexity). Short transcripts (< 1 kb) may miss regulatory elements. Mutations in UTRs can cause disease by disrupting regulation."
}

export default calcDef
