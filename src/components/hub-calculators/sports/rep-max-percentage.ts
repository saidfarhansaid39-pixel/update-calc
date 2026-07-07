import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ reps: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 30 }, '1-30') }),
  fields: [ { name: 'reps', label: 'Number of Reps', type: 'number', min: 1, max: 30, step: '1' } ],
  compute: (v) => {
    const pct = Math.max(40, 100 - v.reps * 2.5)
    return { result: pct, label: 'Estimated % of 1RM', unit: '%', steps: [
      { label: 'Reps', value: ''+v.reps }, { label: '% of 1RM', value: pct.toFixed(0)+'%' },
      { label: 'Relative intensity', value: pct > 85 ? 'Maximal strength (1-5 reps)' : pct > 70 ? 'Hypertrophy (6-12 reps)' : 'Muscular endurance (12+ reps)' },
    ]}
  }, description: 'Calculate the percentage of one-rep max for a given rep count using the standard rep-max table.', formula: '%1RM ≈ 100 - (reps × 2.5)', interpretation: 'Use rep-max percentages to select appropriate training loads for specific goals (strength, hypertrophy, endurance).'
}

export default calcDef
