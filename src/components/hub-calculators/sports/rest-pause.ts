import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ targetReps: z.string().min(1).refine(v => parseFloat(v) > 0), weight: z.string().min(1).refine(v => parseFloat(v) > 0), restSec: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'targetReps', label: 'Target Total Reps', type: 'number', min: 5, step: '1' },
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
    { name: 'restSec', label: 'Rest Between Mini-Sets', type: 'number', unit: 's', min: 5, max: 60, step: '5' },
  ],
  compute: (v) => {
    const clusters = Math.ceil(v.targetReps / 3); const avgMiniSet = v.targetReps / clusters; const totalRest = (clusters - 1) * v.restSec
    return { result: clusters, label: 'Mini-Sets Needed', unit: '', steps: [
      { label: 'Target total reps', value: ''+v.targetReps }, { label: 'Weight', value: v.weight+' kg' },
      { label: 'Mini-sets', value: clusters+' × ~'+Math.round(avgMiniSet)+' reps' },
      { label: 'Rest between', value: v.restSec+' s (total rest: '+totalRest+' s)' },
    ]}
  }, description: 'Plan rest-pause training sets. This intensity technique allows more reps at heavy loads by taking brief rests between mini-sets.', formula: 'Rest-pause: mini-sets × reps with 10-20s rest', interpretation: 'Rest-pause training increases total rep volume at high intensities, stimulating muscle growth and strength.'
}

export default calcDef
