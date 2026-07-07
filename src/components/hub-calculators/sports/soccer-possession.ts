import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    teamTimeMin: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    totalTimeMin: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'teamTimeMin', label: 'Your Team Possession Time', type: 'number', unit: 'min', min: 0, step: '0.5' },
    { name: 'totalTimeMin', label: 'Total Match Time', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.teamTimeMin / v.totalTimeMin * 100
    return {
      result: pct, label: 'Possession Percentage', unit: '%',
      steps: [
        { label: 'Team possession', value: `${v.teamTimeMin} min` },
        { label: 'Total match time', value: `${v.totalTimeMin} min` },
        { label: 'Possession %', value: `${pct.toFixed(1)}%` },
        { label: 'Opponent possession', value: `${(100 - pct).toFixed(1)}%` },
        { label: 'Interpretation', value: pct > 60 ? 'Dominant possession' : pct > 50 ? 'Slight advantage' : pct > 40 ? 'Competitive' : 'Defensive posture' },
      ]
}
  },
  description: 'Calculate soccer possession percentage based on time with the ball. Possession is a key performance metric that reflects a team\'s ability to control the game tempo.'
}

export default calcDef
