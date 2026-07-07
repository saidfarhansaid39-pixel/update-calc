import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    currentPct: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 100 }, '0-100'),
    targetPct: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'currentPct', label: 'Current Confluence', type: 'number', unit: '%', min: 1, max: 100, step: '5' },
    { name: 'targetPct', label: 'Target Seeding Confluence', type: 'number', unit: '%', min: 1, max: 50, step: '5' },
  ],
  compute: (v) => {
    const splitRatio = v.currentPct / v.targetPct
    return {
      result: splitRatio, label: 'Recommended Split Ratio', unit: '1:',
      steps: [
        { label: 'Current confluence', value: `${v.currentPct}%` },
        { label: 'Target seeding density', value: `${v.targetPct}%` },
        { label: 'Split ratio = current / target', value: `1:${splitRatio.toFixed(1)}` },
        { label: 'Common flask split', value: `Try 1:${Math.round(splitRatio)} or nearest standard ratio` },
        { label: 'Doublings before harvest', value: `${Math.log2(splitRatio).toFixed(1)} population doublings` },
      ]
}
  },
  description: 'Cell passaging (splitting) maintains healthy cultures by transferring cells to fresh media at lower density. The split ratio determines how many new flasks can be seeded from one confluent flask.',
  formula: 'Split ratio = Current confluence / Target confluence | Common: 1:2, 1:3, 1:4, 1:10 | Passage number increases by 1 per trypsinization',
  interpretation: 'Typical adherent cell split ratios: HeLa (1:4-1:8), HEK293 (1:3-1:5), primary cells (1:2-1:3). Lower split ratios for slow-growing cells. Record passage number and avoid exceeding passage limits for primary cells.'
}

export default calcDef
