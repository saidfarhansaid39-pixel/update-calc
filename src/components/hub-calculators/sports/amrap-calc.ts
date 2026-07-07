import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rounds: z.string().min(1).refine(v => parseFloat(v) >= 0), reps: z.string().min(1).refine(v => parseFloat(v) >= 0) }),
  fields: [
    { name: 'rounds', label: 'Complete Rounds', type: 'number', min: 0, step: '1' },
    { name: 'reps', label: 'Partial Round Reps', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const total = v.rounds * 100 + v.reps
    return { result: total, label: 'AMRAP Score', unit: '', steps: [
      { label: 'Rounds', value: ''+v.rounds }, { label: 'Partial reps', value: ''+v.reps },
      { label: 'Score', value: v.rounds+' rounds + '+v.reps+' reps' },
    ]}
  }, description: 'Calculate AMRAP (As Many Rounds As Possible) workout score. Standard CrossFit and HIIT format for timed workout scoring.', formula: 'AMRAP score = complete rounds + partial reps', interpretation: 'Compare AMRAP scores over time to measure improving work capacity and muscular endurance.'
}

export default calcDef
