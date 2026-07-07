import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rating: z.string().min(1).refine(v => parseFloat(v) >= 1 && parseFloat(v) <= 10, '1-10'), entries: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), goodThreshold: z.string().min(1).refine(v => parseFloat(v) >= 1 && parseFloat(v) <= 10, '1-10') }),
  fields: [
    { name: 'rating', label: 'Today Mood (1-10)', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'entries', label: 'Total Tracked Entries', type: 'number', min: 1, step: '1' },
    { name: 'goodThreshold', label: '"Good Day" Threshold (1-10)', type: 'number', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => { const avg = v.rating; const goodPct = (avg >= v.goodThreshold ? 1 : 0) * 100; const projectedGoodDays = Math.round((goodPct / 100) * 365); const scoreLabel = v.rating <= 3 ? 'Low' : v.rating <= 6 ? 'Moderate' : 'High'; return { result: avg, label: 'Current Mood Score', unit: '/10', steps: [{ label: 'Current Mood', value: `${v.rating}/10 (${scoreLabel})` }, { label: 'Good Day Threshold', value: `${v.goodThreshold}/10` }, { label: 'Today is Good Day', value: goodPct === 100 ? 'Yes' : 'No' }, { label: 'Projected Good Days/Year', value: `${projectedGoodDays} days` }] } },
  description: 'Track and analyze your daily mood on a 1-10 scale with projections for overall well-being patterns and good day frequency.',
  formula: 'Good Day % = (Current Rating ≥ Threshold ? 100 : 0)% | Projected = Good Day % × 365',
  interpretation: 'Consistent tracking reveals patterns: sleep, exercise, diet, and social connections strongly influence mood. Aim for average above 6/10. Seek professional help if consistently below 4/10.'
}

export default calcDef
