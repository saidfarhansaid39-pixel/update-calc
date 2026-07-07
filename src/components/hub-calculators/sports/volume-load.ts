import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sets: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), reps: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'sets', label: 'Sets', type: 'number', min: 1, step: '1' },
    { name: 'reps', label: 'Reps per Set', type: 'number', min: 1, step: '1' },
    { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const vl = v.sets * v.reps * v.weight
    return { result: vl, label: 'Volume Load', unit: 'kg', steps: [
      { label: 'Sets × Reps × Weight', value: v.sets+' × '+v.reps+' × '+v.weight+' kg' },
      { label: 'Total volume', value: vl.toFixed(0)+' kg' },
      { label: 'Sets × Reps', value: (v.sets * v.reps)+' total reps' },
    ]}
  }, description: 'Calculate total training volume load (sets × reps × weight). Volume load is a key driver of muscle hypertrophy and strength gains.', formula: 'Volume Load = sets × reps × weight (kg)', interpretation: 'Higher volume loads drive hypertrophy. Progressively increase volume load over time for continued adaptation.'
}

export default calcDef
