import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ctTarget: z.string().refine(v => parseFloat(v) > 0, '>0'),
    ctControl: z.string().refine(v => parseFloat(v) > 0, '>0'),
    ctRef: z.string().refine(v => parseFloat(v) > 0, '>0'),
    ctRefControl: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'ctTarget', label: 'Ct (Target Gene, Treated)', type: 'number', min: 1, step: '0.1' },
    { name: 'ctControl', label: 'Ct (Target Gene, Control)', type: 'number', min: 1, step: '0.1' },
    { name: 'ctRef', label: 'Ct (Reference Gene, Treated)', type: 'number', min: 1, step: '0.1' },
    { name: 'ctRefControl', label: 'Ct (Reference Gene, Control)', type: 'number', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const deltaCtTarget = v.ctTarget - v.ctControl
    const deltaCtRef = v.ctRef - v.ctRefControl
    const deltaDeltaCt = deltaCtTarget - deltaCtRef
    const foldChange = 2 ** (-deltaDeltaCt)
    return {
      result: foldChange, label: 'Relative Expression (2^-??Ct)', unit: 'fold change',
      steps: [
        { label: '?Ct target = Ct(target,treated) - Ct(target,control)', value: `${deltaCtTarget.toFixed(2)}` },
        { label: '?Ct reference = Ct(ref,treated) - Ct(ref,control)', value: `${deltaCtRef.toFixed(2)}` },
        { label: '??Ct = ?Ct(target) - ?Ct(ref)', value: `${deltaDeltaCt.toFixed(2)}` },
        { label: 'Fold change = 2^-??Ct', value: `${foldChange.toFixed(3)}` },
        { label: 'Up/down regulation', value: foldChange > 1 ? `${foldChange.toFixed(2)}× up-regulated` : foldChange < 1 ? `${(1/foldChange).toFixed(2)}× down-regulated` : 'No change' },
      ]
}
  },
  description: 'The delta-delta Ct method quantifies relative gene expression changes between treated and control samples, normalized to a reference (housekeeping) gene.',
  formula: '??Ct = ?Ct(target) - ?Ct(reference) | Fold change = 2^(-??Ct) | Requires E ˜ 100% for both target and reference',
  interpretation: 'Fold change > 1: target is up-regulated in treated vs control. Fold change < 1: down-regulated. Statistical significance should be assessed with biological replicates.'
}

export default calcDef
