import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ duration: z.string().min(1).refine(v => parseFloat(v) > 0), focus: z.string().optional() }),
  fields: [
    { name: 'duration', label: 'Session Duration', type: 'number', unit: 'min', min: 20, max: 90, step: '5' },
    { name: 'focus', label: 'Focus Area (optional)', type: 'select', options: [{ label: 'Full Body', value: 'full' }, { label: 'Core', value: 'core' }, { label: 'Lower Body', value: 'lower' }, { label: 'Upper Body', value: 'upper' }] },
  ],
  compute: (v) => {
    const mat = Math.round(v.duration * 0.7); const reformer = v.duration - mat
    return { result: v.duration, label: 'Pilates Session', unit: 'min', steps: [
      { label: 'Total session', value: v.duration+' min' },
      { label: 'Mat work / warm-up', value: mat+' min' },
      { label: 'Reformer / equipment', value: reformer+' min' },
      ...(v.focus ? [{ label: 'Focus', value: v.focus === 'core' ? 'Emphasize powerhouse exercises' : v.focus === 'lower' ? 'Focus on glutes and legs' : v.focus === 'upper' ? 'Upper body and arms emphasis' : 'Balanced full body workout' }] : []),
    ]}
  }, description: 'Plan a Pilates session with mat work and equipment components. Pilates improves core strength, posture, and body awareness.', formula: 'Session: 70% mat work, 30% equipment/reformer', interpretation: 'Consistent Pilates practice develops deep core stability, spinal mobility, and balanced muscle development.'
}

export default calcDef
