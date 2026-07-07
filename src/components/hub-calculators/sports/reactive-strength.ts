import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ jumpCm: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), contactMs: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'jumpCm', label: 'Jump Height', type: 'number', unit: 'cm', min: 1, step: '0.5' },
    { name: 'contactMs', label: 'Ground Contact Time', type: 'number', unit: 'ms', min: 100, max: 1000, step: '10' },
  ],
  compute: (v) => {
    const rsi = v.jumpCm / (v.contactMs / 1000)
    return { result: rsi, label: 'Reactive Strength Index', unit: '', steps: [
      { label: 'Jump height', value: v.jumpCm+' cm' }, { label: 'Contact time', value: v.contactMs+' ms ('+(v.contactMs/1000).toFixed(3)+' s)' },
      { label: 'RSI', value: rsi.toFixed(2) }, { label: 'Rating', value: rsi > 2.5 ? 'Excellent' : rsi > 2.0 ? 'Good' : rsi > 1.5 ? 'Average' : 'Needs improvement' },
    ]}
  }, description: 'Calculate Reactive Strength Index (RSI) from jump height and ground contact time. RSI measures plyometric ability and elastic strength.', formula: 'RSI = jump height (m) / contact time (s)', interpretation: 'Higher RSI indicates better stretch-shortening cycle function. >2.5 is excellent for most sports.'
}

export default calcDef
