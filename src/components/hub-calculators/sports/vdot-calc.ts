import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distRace: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    timeMin: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'distRace', label: 'Race Distance', type: 'number', unit: 'km', min: 0.5, step: '0.1' },
    { name: 'timeMin', label: 'Finish Time', type: 'number', unit: 'min', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const speedMs = (v.distRace * 1000) / (v.timeMin * 60)
    const vdot = speedMs * 3.5 / 0.95
    const easyPace = 60 / (vdot * 0.7 / 3.5) * 0.85
    const easyMin = Math.floor(easyPace)
    const easySec = Math.round((easyPace - easyMin) * 60)
    const mpPace = 60 / (vdot * 0.85 / 3.5) * 0.9
    const mpMin = Math.floor(mpPace)
    const mpSec = Math.round((mpPace - mpMin) * 60)
    return {
      result: vdot, label: 'VDOT Value', unit: '',
      steps: [
        { label: 'Race distance', value: `${v.distRace} km in ${v.timeMin} min` },
        { label: 'Speed', value: `${speedMs.toFixed(2)} m/s` },
        { label: 'VDOT', value: `${vdot.toFixed(1)}` },
        { label: 'Easy run pace', value: `${easyMin}:${easySec.toString().padStart(2, '0')} /km` },
        { label: 'Marathon pace', value: `${mpMin}:${mpSec.toString().padStart(2, '0')} /km` },
      ]
}
  },
  description: 'Calculate your VDOT value from a recent race performance using Jack Daniels\' Running Formula. VDOT is a measure of running ability used to prescribe training paces for easy, marathon, threshold, and interval workouts.'
}

export default calcDef
