import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    maxHR: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 100 && val <= 250 }, '100-250'),
    restingHR: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 30 && val <= 100 }, '30-100')
}),
  fields: [
    { name: 'maxHR', label: 'Max Heart Rate', type: 'number', unit: 'bpm', min: 100, max: 250, step: '1' },
    { name: 'restingHR', label: 'Resting Heart Rate', type: 'number', unit: 'bpm', min: 30, max: 100, step: '1' },
  ],
  compute: (v) => {
    const hrr = v.maxHR - v.restingHR
    const zoneLow = v.restingHR + hrr * 0.6
    const zoneHigh = v.restingHR + hrr * 0.7
    const zone65 = v.restingHR + hrr * 0.65
    return {
      result: zone65, label: 'Target Recovery HR (65%)', unit: 'bpm',
      steps: [
        { label: 'Max HR', value: `${v.maxHR} bpm` },
        { label: 'Resting HR', value: `${v.restingHR} bpm` },
        { label: 'HR Reserve', value: `${hrr} bpm` },
        { label: 'Recovery zone (60-70%)', value: `${zoneLow.toFixed(0)}-${zoneHigh.toFixed(0)} bpm` },
        { label: 'Perceived effort', value: 'Very light, conversational pace' },
      ]
}
  },
  description: 'Find your recovery run heart rate zone (60-70% of HR Reserve). Recovery runs at low intensity promote blood flow, reduce muscle soreness, and build aerobic base.'
}

export default calcDef
