import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exA_reps: z.string().min(1).refine(v => parseFloat(v) > 0), exB_reps: z.string().min(1).refine(v => parseFloat(v) > 0), sets: z.string().min(1).refine(v => parseFloat(v) > 0), restSec: z.string().optional() }),
  fields: [
    { name: 'exA_reps', label: 'Exercise A Reps', type: 'number', min: 1, step: '1' },
    { name: 'exB_reps', label: 'Exercise B Reps', type: 'number', min: 1, step: '1' },
    { name: 'sets', label: 'Number of Sets', type: 'number', min: 1, max: 10, step: '1' },
    { name: 'restSec', label: 'Rest Per Superset (optional)', type: 'number', unit: 's', min: 10, step: '10' },
  ],
  compute: (v) => {
    const totalReps = (v.exA_reps + v.exB_reps) * v.sets
    return { result: totalReps, label: 'Total Reps (Both Exercises)', unit: '', steps: [
      { label: 'Superset pair', value: 'A: '+v.exA_reps+' reps → B: '+v.exB_reps+' reps' },
      { label: 'Sets', value: ''+v.sets }, { label: 'Total reps', value: ''+totalReps },
      ...(v.restSec ? [{ label: 'Rest per superset', value: v.restSec+' s' }] : []),
    ]}
  }, description: 'Calculate superset training volume. Supersets pair two exercises back-to-back to increase training density and metabolic stress.', formula: 'Total volume = (A reps + B reps) × sets', interpretation: 'Supersets save time and increase metabolic stress. Opposing muscle group supersets allow better recovery.'
}

export default calcDef
