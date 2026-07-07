import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    walks: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    hits: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    innings: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'walks', label: 'Walks Allowed', type: 'number', min: 0, step: '1' },
    { name: 'hits', label: 'Hits Allowed', type: 'number', min: 0, step: '1' },
    { name: 'innings', label: 'Innings Pitched', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const total = v.walks + v.hits
    const whip = total / v.innings
    return {
      result: whip, label: 'WHIP', unit: '',
      steps: [
        { label: 'Walks', value: `${v.walks}` },
        { label: 'Hits', value: `${v.hits}` },
        { label: 'Total baserunners', value: `${total}` },
        { label: 'Innings pitched', value: `${v.innings}` },
        { label: 'WHIP', value: `${whip.toFixed(2)}` },
        { label: 'Rating', value: whip < 1.00 ? 'Excellent' : whip < 1.20 ? 'Very Good' : whip < 1.40 ? 'Average' : whip < 1.60 ? 'Below Average' : 'Poor' },
      ]
}
  },
  description: 'Calculate WHIP (Walks plus Hits per Inning Pitched), a key baseball pitching statistic. A WHIP below 1.00 is considered elite; the league average is typically around 1.30.'
}

export default calcDef
