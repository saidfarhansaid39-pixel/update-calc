import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    thresholdPaceMin: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 2 && val <= 10 }, '2-10 min/km'),
    thresholdPaceSec: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 59 }, '0-59'),
    duration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'thresholdPaceMin', label: 'Threshold Pace (min/km)', type: 'number', min: 2, max: 10, step: '0.1' },
    { name: 'thresholdPaceSec', label: 'Extra Seconds', type: 'number', min: 0, max: 59, step: '1' },
    { name: 'duration', label: 'Tempo Duration', type: 'number', unit: 'min', min: 5, step: '5' },
  ],
  compute: (v) => {
    const paceTotalSec = v.thresholdPaceMin * 60 + v.thresholdPaceSec
    const speedKmh = 3600 / paceTotalSec
    const distanceKm = speedKmh * (v.duration / 60)
    const easyPaceSec = paceTotalSec * 1.15
    const easyMin = Math.floor(easyPaceSec / 60)
    const easySec = Math.round(easyPaceSec % 60)
    return {
      result: speedKmh, label: 'Threshold Speed', unit: 'km/h',
      steps: [
        { label: 'Threshold pace', value: `${v.thresholdPaceMin}:${v.thresholdPaceSec.toString().padStart(2, '0')} /km` },
        { label: 'Tempo duration', value: `${v.duration} min` },
        { label: 'Distance covered', value: `${distanceKm.toFixed(2)} km` },
        { label: 'Easy run pace', value: `${easyMin}:${easySec.toString().padStart(2, '0')} /km (15% slower)` },
      ]
}
  },
  description: 'Calculate tempo run distance and easy pace from your lactate threshold pace. Tempo runs improve lactate clearance and sustained speed at threshold intensity.'
}

export default calcDef
