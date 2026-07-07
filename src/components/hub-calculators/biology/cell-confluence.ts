import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    coveredArea: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'coveredArea', label: 'Estimated % Area Covered', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const pct = v.coveredArea
    const stage = pct < 30 ? 'Early (log phase)' : pct < 60 ? 'Mid-log' : pct < 90 ? 'Late log / near confluent' : 'Confluent — passage recommended'
    return {
      result: pct, label: 'Cell Confluence', unit: '%',
      steps: [
        { label: 'Estimated confluence', value: `${pct}%` },
        { label: 'Growth stage', value: stage },
        { label: 'Seeding for next passage', value: pct >= 80 ? `Seed ${Math.max(1, Math.round(pct / 4))}× dilution` : 'Not ready for passage' },
        { label: 'Recommended action', value: pct >= 80 ? 'Passage cells (split 1:3–1:10)' : pct >= 50 ? 'Replace media if > 48 h' : 'Let cells grow to 70-80%' },
      ]
}
  },
  description: 'Cell confluence is the percentage of culture surface covered by adherent cells. Regular monitoring ensures consistent experimental timing and prevents overgrowth.',
  formula: 'Confluence (%) = (area covered by cells / total area) × 100% | Passage at 70-90% confluence depending on cell type',
  interpretation: 'Early phase: < 30%. Mid-log: 30-60%. Late log: 60-90%. Confluent: > 90%. Passage at 70-80% for most adherent lines. Over-confluence leads to contact inhibition, differentiation, or cell death.'
}

export default calcDef
