import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pts: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), fga: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0), fta: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0) }),
  fields: [
    { name: 'pts', label: 'Total Points', type: 'number', min: 0, step: '1' },
    { name: 'fga', label: 'Field Goals Attempted', type: 'number', min: 1, step: '1' },
    { name: 'fta', label: 'Free Throws Attempted', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const ts = v.pts / (2 * (v.fga + 0.44 * v.fta)) * 100
    return { result: ts, label: 'True Shooting Percentage', unit: '%', steps: [
      { label: 'Points', value: ''+v.pts }, { label: 'FGA', value: ''+v.fga },
      { label: 'FTA', value: ''+v.fta }, { label: 'TS%', value: ts.toFixed(1)+'%' },
      { label: 'NBA benchmark', value: ts > 60 ? 'Excellent (elite efficiency)' : ts > 55 ? 'Good (above average)' : ts > 50 ? 'Average' : 'Below average' },
    ]}
  }, description: 'Calculate True Shooting Percentage (TS%), measuring scoring efficiency accounting for 2-pointers, 3-pointers, and free throws.', formula: 'TS% = PTS / (2 × (FGA + 0.44 × FTA)) × 100', interpretation: 'TS% above 60% is elite. TS% is a more complete efficiency metric than FG% because it includes the value of 3-pointers and free throws.'
}

export default calcDef
