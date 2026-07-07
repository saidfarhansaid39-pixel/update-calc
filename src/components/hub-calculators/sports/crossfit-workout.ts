import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rounds: z.string().min(1).refine(v => parseFloat(v) >= 0), extraReps: z.string().min(1).refine(v => parseFloat(v) >= 0) }),
  fields: [
    { name: 'rounds', label: 'Full Rounds Completed', type: 'number', min: 0, step: '0.5' },
    { name: 'extraReps', label: 'Extra Reps', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const score = v.rounds * 100 + v.extraReps
    return { result: score, label: 'WOD Score', unit: '', steps: [
      { label: 'Rounds', value: ''+v.rounds }, { label: 'Extra reps', value: ''+v.extraReps },
      { label: 'Total score', value: v.rounds+' rounds + '+v.extraReps+' reps' },
    ]}
  }, description: 'Calculate CrossFit WOD score (rounds + reps). Common benchmark WODs include Fran, Cindy, Helen, and Murph.', formula: 'Score = rounds completed + any partial round reps', interpretation: 'Track your benchmark WOD scores over time to measure fitness improvements across multiple domains.'
}

export default calcDef
