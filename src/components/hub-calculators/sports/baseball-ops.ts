import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    hits: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    walks: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    hbp: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    singles: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    doubles: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    triples: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    hrs: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    atBats: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0'),
    sacFlies: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'hits', label: 'Hits', type: 'number', min: 0, step: '1' },
    { name: 'singles', label: 'Singles', type: 'number', min: 0, step: '1' },
    { name: 'doubles', label: 'Doubles', type: 'number', min: 0, step: '1' },
    { name: 'triples', label: 'Triples', type: 'number', min: 0, step: '1' },
    { name: 'hrs', label: 'Home Runs', type: 'number', min: 0, step: '1' },
    { name: 'walks', label: 'Walks (BB)', type: 'number', min: 0, step: '1' },
    { name: 'atBats', label: 'At Bats', type: 'number', min: 1, step: '1' },
    { name: 'hbp', label: 'Hit By Pitch (optional)', type: 'number', min: 0, step: '1' },
    { name: 'sacFlies', label: 'Sacrifice Flies (optional)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const hbp = v.hbp || 0
    const sacFlies = v.sacFlies || 0
    const avg = v.hits / v.atBats
    const tb = v.singles + v.doubles * 2 + v.triples * 3 + v.hrs * 4
    const slg = tb / v.atBats
    const obpPAs = v.atBats + v.walks + hbp + sacFlies
    const obp = obpPAs > 0 ? (v.hits + v.walks + hbp) / obpPAs : 0
    const ops = obp + slg
    return {
      result: ops, label: 'OPS', unit: '',
      steps: [
        { label: 'AVG', value: `${avg.toFixed(3)}` },
        { label: 'OBP', value: `${obp.toFixed(3)}` },
        { label: 'SLG', value: `${slg.toFixed(3)}` },
        { label: 'OPS', value: `${ops.toFixed(3)}` },
        { label: 'Rating', value: ops > 0.900 ? 'Excellent' : ops > 0.800 ? 'Very Good' : ops > 0.700 ? 'Above Average' : ops > 0.600 ? 'Average' : 'Below Average' },
      ]
}
  },
  description: 'Calculate On-base Plus Slugging (OPS), a key baseball offensive statistic. OPS combines on-base percentage and slugging percentage to measure a player\'s overall offensive productivity.'
}

export default calcDef
