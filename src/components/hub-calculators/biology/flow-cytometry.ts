import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalEvents: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    gatePct: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'totalEvents', label: 'Total Events Acquired', type: 'number', min: 100, step: '100' },
    { name: 'gatePct', label: 'Cells in Gate (Population %)', type: 'number', min: 0, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const gateCount = v.totalEvents * v.gatePct / 100
    return {
      result: gateCount, label: 'Population Cell Count', unit: 'cells',
      steps: [
        { label: 'Total events acquired', value: `${v.totalEvents.toLocaleString()}` },
        { label: 'Gated population', value: `${v.gatePct}%` },
        { label: 'Count in gate', value: `${gateCount.toFixed(0).toLocaleString()} cells` },
        { label: 'Min events rule', value: gateCount < 100 ? 'Low — <100 events in gate may not be statistically reliable' : 'Adequate events for analysis' },
        { label: 'Compensation', value: 'Proper compensation is critical for multicolor panels' },
      ]
}
  },
  description: 'Flow cytometry counts and characterizes cells or particles in suspension. Fluorophore-labeled antibodies enable multi-parameter analysis of cell populations through gating.',
  formula: 'Population count = Total events × Gate % / 100% | Collect 10,000-50,000 events per sample | Minimum 100 events in rare populations',
  interpretation: 'Target 10,000-50,000 viable single cells per sample. Gate sequentially: FSC/SSC (cells) ? singles (FSC-H/FSC-A) ? viability ? markers. Fluorescence compensation corrects for spectral overlap between fluorophores.'
}

export default calcDef
