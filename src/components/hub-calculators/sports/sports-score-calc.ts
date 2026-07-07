import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ score: z.string().min(1).refine(v => parseFloat(v) > 0, 'Must be > 0'), opponent: z.string().min(1).refine(v => parseFloat(v) >= 0, 'Must be >= 0') }),
  fields: [
    { name: 'score', label: 'Your Score', type: 'number', min: 0, step: '1' },
    { name: 'opponent', label: 'Opponent Score', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const s = v.score, o = v.opponent; const total = s + o; const pct = total > 0 ? (s / total) * 100 : 50
    return { result: s - o, label: 'Point Differential', unit: '', steps: [{ label: 'Your score', value: '' + s }, { label: 'Opponent score', value: '' + o }, { label: 'Win %', value: pct.toFixed(1) + '%' }] }
  },
  description: 'Calculate sports score differential and win percentage. Useful for tracking game performance, league standings, and team statistics.'
}

export default calcDef
