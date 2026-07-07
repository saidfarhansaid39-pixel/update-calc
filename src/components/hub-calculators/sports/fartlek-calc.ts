import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    fastMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    easyMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'totalMin', label: 'Total Session Duration', type: 'number', unit: 'min', min: 10, step: '5' },
    { name: 'fastMin', label: 'Fast Segment Duration', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
    { name: 'easyMin', label: 'Easy Recovery Duration', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const cycleTime = v.fastMin + v.easyMin
    const cycles = Math.floor(v.totalMin / cycleTime)
    const remainder = v.totalMin - cycles * cycleTime
    const totalFast = cycles * v.fastMin + Math.min(remainder, v.fastMin)
    const totalEasy = cycles * v.easyMin + Math.max(0, remainder - v.fastMin)
    return {
      result: cycles, label: 'Complete Fartlek Cycles', unit: '',
      steps: [
        { label: 'Total duration', value: `${v.totalMin} min` },
        { label: 'Fast/easy cycle', value: `${v.fastMin} min fast + ${v.easyMin} min easy` },
        { label: 'Complete cycles', value: `${cycles}` },
        { label: 'Total fast time', value: `${totalFast.toFixed(1)} min (${(totalFast / v.totalMin * 100).toFixed(0)}%)` },
        { label: 'Total recovery', value: `${totalEasy.toFixed(1)} min` },
      ]
}
  },
  description: 'Plan a fartlek (speed play) session by setting fast and easy segments. Fartlek training alternates between fast running and recovery throughout the session.'
}

export default calcDef
