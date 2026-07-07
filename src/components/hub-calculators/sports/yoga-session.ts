import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ duration: z.string().min(1).refine(v => parseFloat(v) > 0), level: z.string().optional() }),
  fields: [
    { name: 'duration', label: 'Session Duration', type: 'number', unit: 'min', min: 15, max: 120, step: '5' },
    { name: 'level', label: 'Level (optional)', type: 'select', options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }] },
  ],
  compute: (v) => {
    const warmup = Math.round(v.duration * 0.15); const main = Math.round(v.duration * 0.65); const cooldown = v.duration - warmup - main
    return { result: v.duration, label: 'Session Duration', unit: 'min', steps: [
      { label: 'Total session', value: v.duration+' min' },
      { label: 'Warm-up / breathing', value: warmup+' min (15%)' },
      { label: 'Main asana practice', value: main+' min (65%)' },
      { label: 'Cool-down / savasana', value: cooldown+' min (20%)' },
      ...(v.level ? [{ label: 'Level', value: v.level === 'beginner' ? 'Focus on foundational poses' : v.level === 'intermediate' ? 'Include standing balances and inversions' : 'Advanced sequencing with arm balances' }] : []),
    ]}
  }, description: 'Plan a balanced yoga session with warm-up, main practice, and cool-down phases.', formula: 'Session structure: 15% warm-up / 65% main practice / 20% cool-down', interpretation: 'A well-structured yoga session progressively opens the body, builds to peak poses, and winds down for relaxation.'
}

export default calcDef
