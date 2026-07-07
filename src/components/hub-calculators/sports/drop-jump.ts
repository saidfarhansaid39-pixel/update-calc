import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dropH: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), reboundH: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'dropH', label: 'Drop Height', type: 'number', unit: 'cm', min: 10, max: 100, step: '5' },
    { name: 'reboundH', label: 'Rebound Jump Height', type: 'number', unit: 'cm', min: 1, step: '1' },
  ],
  compute: (v) => {
    const rsiMod = v.reboundH / v.dropH
    return { result: v.reboundH, label: 'Rebound Height', unit: 'cm', steps: [
      { label: 'Drop height', value: v.dropH+' cm' }, { label: 'Rebound height', value: v.reboundH+' cm' },
      { label: 'RSI modified', value: rsiMod.toFixed(2) },
      { label: 'Optimal drop height', value: rsiMod > 1.0 ? 'Drop height may be too low' : rsiMod > 0.7 ? 'Good drop height' : 'Drop height may be too high' },
    ]}
  }, description: 'Analyze drop jump performance. The drop jump measures reactive strength and the optimal drop height for plyometric training.', formula: 'RSI-modified = rebound height / drop height', interpretation: 'The optimal drop height maximizes rebound height. A drop height producing ~0.7-1.0 RSI-mod is ideal for power development.'
}

export default calcDef
