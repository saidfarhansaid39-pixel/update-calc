import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    strides: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'distance', label: 'Run Distance', type: 'number', unit: 'm', min: 10, step: '5' },
    { name: 'strides', label: 'Stride Count', type: 'number', min: 10, step: '1' },
    { name: 'time', label: 'Time', type: 'number', unit: 's', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const strideLength = v.distance / v.strides
    const strideFreq = v.strides / v.time
    const speed = v.distance / v.time
    return {
      result: strideLength, label: 'Average Stride Length', unit: 'm',
      steps: [
        { label: 'Distance', value: `${v.distance} m` },
        { label: 'Stride count', value: `${v.strides}` },
        { label: 'Stride length', value: `${strideLength.toFixed(2)} m` },
        { label: 'Stride frequency', value: `${strideFreq.toFixed(2)} strides/s (${(strideFreq * 60).toFixed(0)} spm)` },
        { label: 'Speed', value: `${speed.toFixed(2)} m/s (${(speed * 3.6).toFixed(1)} km/h)` },
      ]
}
  },
  description: 'Analyze your running stride by measuring stride length and frequency. Elite runners typically maintain 180+ steps per minute with longer stride lengths.'
}

export default calcDef
