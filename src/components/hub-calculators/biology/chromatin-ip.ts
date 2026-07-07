import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ipCt: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    inputCt: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    inputDilution: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'ipCt', label: 'IP Sample Cq (Ct) value', type: 'number', min: 0, step: '0.1' },
    { name: 'inputCt', label: 'Input (Total) Cq (Ct) value', type: 'number', min: 0, step: '0.1' },
    { name: 'inputDilution', label: 'Input Dilution Factor', type: 'number', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const deltaCt = v.ipCt - v.inputCt
    const inputAdjust = Math.log2(v.inputDilution)
    const pctInput = Math.pow(2, -(deltaCt - inputAdjust)) * 100
    const foldEnrichment = pctInput > 0 ? pctInput / 0.1 : 0
    return {
      result: pctInput, label: '% Input (Relative to Total)', unit: '%',
      steps: [
        { label: 'IP Cq', value: `${v.ipCt.toFixed(1)}` },
        { label: 'Input Cq', value: `${v.inputCt.toFixed(1)}` },
        { label: 'Input dilution factor', value: `${v.inputDilution}x` },
        { label: '?Ct = IP Ct - Input Ct', value: `${deltaCt.toFixed(2)}` },
        { label: 'Input adjustment = log2(dilution)', value: `${inputAdjust.toFixed(2)}` },
        { label: '% Input = 2^(-?Ct + adj) × 100%', value: `${pctInput.toFixed(3)}%` },
        { label: 'Fold enrichment vs IgG/neg control', value: foldEnrichment > 2 ? `${foldEnrichment.toFixed(1)}x enrichment` : 'Not significantly enriched' },
      ]
}
  },
  description: 'Chromatin Immunoprecipitation (ChIP) followed by qPCR quantifies protein-DNA interactions. Percent input method normalizes IP signal to the total chromatin input, controlling for chromatin amount and amplification efficiency.',
  formula: '% Input = 2^(-(IP Ct - Input Ct) + log2(dilution factor)) × 100% | Fold enrichment = %Input(IP) / %Input(IgG or negative control)',
  interpretation: 'Enrichment > 2% input is typically strong binding. Fold enrichment > 3-5 over IgG is significant. Use negative control region (e.g., gene desert) to confirm specificity. Spike-in normalization (Drosophila antibody) is more accurate for global histone marks.'
}

export default calcDef
