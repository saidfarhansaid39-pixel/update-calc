import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ballSpeed: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    launchAngle: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 && val < 50 }, '0-50°'),
    spinRpm: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 5000 }, '0-5000')
}),
  fields: [
    { name: 'ballSpeed', label: 'Ball Speed', type: 'number', unit: 'mph', min: 50, max: 200, step: '1' },
    { name: 'launchAngle', label: 'Launch Angle', type: 'number', unit: '°', min: 5, max: 35, step: '1' },
    { name: 'spinRpm', label: 'Backspin Rate', type: 'number', unit: 'RPM', min: 0, max: 5000, step: '100' },
  ],
  compute: (v) => {
    const carryOptimal = v.ballSpeed * 2.3 - (v.spinRpm / 1000) * 3 + (v.launchAngle - 12) * 2
    const carryAdjusted = Math.max(carryOptimal, v.ballSpeed * 0.8)
    const spinEfficiency = v.spinRpm < 2500 ? 'Optimal spin window' : v.spinRpm < 3500 ? 'Moderate spin' : 'High spin (loss of distance)'
    return {
      result: carryAdjusted, label: 'Estimated Carry Distance', unit: 'yards',
      steps: [
        { label: 'Ball speed', value: `${v.ballSpeed} mph` },
        { label: 'Launch angle', value: `${v.launchAngle}°` },
        { label: 'Backspin', value: `${v.spinRpm} RPM` },
        { label: 'Smash factor (est.)', value: `${(v.ballSpeed / (v.ballSpeed * 0.72)).toFixed(2)}` },
        { label: 'Carry distance', value: `${carryAdjusted.toFixed(0)} yards` },
        { label: 'Spin analysis', value: spinEfficiency },
      ]
}
  },
  description: 'Estimate golf driving carry distance from ball speed, launch angle, and backspin rate. Optimal launch conditions produce maximum carry for a given ball speed.'
}

export default calcDef
