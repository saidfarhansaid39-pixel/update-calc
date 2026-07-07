import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    c1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v1: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    c2: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    v2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'c1', label: 'C1 (Stock)', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'v1', label: 'V1 (Stock, optional)', type: 'number', unit: 'mL', min: 0, step: '0.01' },
    { name: 'c2', label: 'C2 (Target, optional)', type: 'number', unit: 'M', min: 0, step: '0.001' },
    { name: 'v2', label: 'V2 (Total, target)', type: 'number', unit: 'mL', min: 0.001, step: '0.01' },
  ],
  compute: (v) => {
    const v1 = v.v1 || 0
    const c2 = v.c2 || 0
    const result = v1 > 0 ? (v.c1 * v1 / v.v2) : (c2 > 0 ? (c2 * v.v2 / v.c1) : 0)
    const label = v1 > 0 ? 'C2 (Target)' : 'V1 (Stock Volume)'
    const unit = v1 > 0 ? 'M' : 'mL'
    return {
      result, label, unit,
      steps: [
        { label: 'C1 (Stock)', value: `${v.c1} M` },
        ...(v1 > 0 ? [{ label: 'V1 (Stock volume)', value: `${v1} mL` }] : []),
        ...(c2 > 0 ? [{ label: 'C2 (Target conc.)', value: `${c2} M` }] : []),
        { label: 'V2 (Total volume)', value: `${v.v2} mL` },
        { label: 'C1 × V1 = C2 × V2', value: v1 > 0 ? `${result.toFixed(4)} M` : `${result.toFixed(2)} mL` },
      ]
}
  },
  description: 'Dilution calculations use the formula C1V1 = C2V2 to determine stock volumes or target concentrations for preparing working solutions from concentrates.',
  formula: 'C1 × V1 = C2 × V2',
  interpretation: 'Dilution factor = V2/V1. A 1:10 dilution means 1 part stock + 9 parts diluent. Serial dilutions are exponential (1:10, 1:100, 1:1000…).'
}

export default calcDef
