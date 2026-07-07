import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    seqLen: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 20 && n <= 23 }, '20-23'),
    mismatches: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 0 && n <= 4 }, '0-4')
}),
  fields: [
    { name: 'seqLen', label: 'Guide + PAM Length', type: 'number', unit: 'nt', min: 20, max: 23, step: '1' },
    { name: 'mismatches', label: 'Mismatches Allowed', type: 'number', min: 0, max: 4, step: '1' },
  ],
  compute: (v) => {
    const sites = 3.2e9 / (4 ** v.seqLen) * (3 ** v.mismatches)
    const logSites = Math.log10(sites)
    const rating = logSites < 0 ? 'Very specific' : logSites < 2 ? 'Specific' : logSites < 5 ? 'Moderate risk' : 'High off-target risk'
    return {
      result: sites, label: 'Predicted Off-Target Sites (human)', unit: 'sites',
      steps: [
        { label: 'Seed + PAM length', value: `${v.seqLen} nt` },
        { label: 'Mismatches tolerated', value: `${v.mismatches}` },
        { label: 'Expected sites (human genome)', value: `${sites.toExponential(2)}` },
        { label: 'Log10(sites)', value: `${logSites.toFixed(2)}` },
        { label: 'Specificity rating', value: rating },
        { label: 'Note', value: 'PAM-proximal seed (8-12 nt) critical for specificity' },
      ]
}
  },
  description: 'CRISPR off-target effects occur when guide RNA binds similar but non-identical genomic sequences. This estimates genome-wide off-target sites based on sequence similarity tolerance.',
  formula: 'Expected sites ˜ (Genome size) / 4^L × 3^m | L = guide+PAM length, m = tolerated mismatches | More mismatches = exponentially more off-target sites',
  interpretation: 'Seed region mismatches (PAM-proximal 8-12 nt) are less tolerated than distal mismatches. High-fidelity Cas9 variants (eSpCas9, SpCas9-HF1) reduce off-target effects by 10-100×.'
}

export default calcDef
