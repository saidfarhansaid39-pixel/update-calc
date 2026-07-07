import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ctTarget: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n < 40 }, '0-40'),
    ctRef: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n < 40 }, '0-40')
}),
  fields: [
    { name: 'ctTarget', label: 'Ct (Target Gene)', type: 'number', min: 1, max: 39, step: '0.1' },
    { name: 'ctRef', label: 'Ct (Reference Gene)', type: 'number', min: 1, max: 39, step: '0.1' },
  ],
  compute: (v) => {
    const dCt = v.ctTarget - v.ctRef
    const rq = 2 ** (-dCt)
    return {
      result: rq, label: 'Relative Quantity (RQ)', unit: '',
      steps: [
        { label: 'Ct (target)', value: `${v.ctTarget.toFixed(1)}` },
        { label: 'Ct (reference)', value: `${v.ctRef.toFixed(1)}` },
        { label: '?Ct = Ct(target) - Ct(ref)', value: `${dCt.toFixed(2)}` },
        { label: 'RQ = 2^(-?Ct)', value: `${rq.toFixed(4)}` },
        { label: 'Expression vs reference', value: rq > 1 ? `${rq.toFixed(2)}× higher` : rq < 1 ? `${(1 / rq).toFixed(2)}× lower` : 'Equal' },
      ]
}
  },
  description: 'RT-qPCR normalization using the ?Ct method with a single reference (housekeeping) gene. Normalizes target expression to endogenous control to correct for RNA input differences.',
  formula: '?Ct = Ct(target) - Ct(reference) | RQ = 2^(-?Ct) | For relative quantification: fold change = 2^(-??Ct) vs calibrator',
  interpretation: 'RQ > 1: target higher expressed than reference. RQ < 1: target lower. For ??Ct method, also need Ct from a calibrator sample. Reference gene stability should be validated across experimental conditions.'
}

export default calcDef
