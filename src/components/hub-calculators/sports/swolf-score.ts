import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ timeSec: z.string().min(1).refine(v => parseFloat(v) > 0), strokes: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'timeSec', label: 'Time for 50m', type: 'number', unit: 's', min: 20, step: '0.1' },
    { name: 'strokes', label: 'Stroke Count (50m)', type: 'number', min: 10, step: '1' },
  ],
  compute: (v) => {
    const swolf = v.timeSec + v.strokes
    return { result: swolf, label: 'SWOLF Score', unit: '', steps: [
      { label: 'Time (50m)', value: v.timeSec+' s' }, { label: 'Strokes (50m)', value: ''+v.strokes },
      { label: 'SWOLF', value: swolf+' (time + strokes)' }, { label: 'Rating', value: swolf < 30 ? 'Elite' : swolf < 40 ? 'Excellent' : swolf < 50 ? 'Good' : swolf < 60 ? 'Average' : 'Needs improvement' },
    ]}
  }, description: 'Calculate SWOLF (Swim Golf) score combining time and stroke count. Lower SWOLF = more efficient swimming.', formula: 'SWOLF = time (s) + stroke count', interpretation: 'Lower SWOLF scores indicate better swimming efficiency. Elite swimmers score < 30 for 50m.'
}

export default calcDef
