import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ jumpCm: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'jumpCm', label: 'Vertical Jump Height', type: 'number', unit: 'cm', min: 1, step: '1' },
    { name: 'weightKg', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const takeoffV = Math.sqrt(2 * 9.81 * v.jumpCm / 100); const peakPower = 2.21 * v.weightKg * takeoffV; const avgPower = peakPower * 0.67
    return { result: peakPower, label: 'Peak Power Output', unit: 'W', steps: [
      { label: 'Jump height', value: v.jumpCm+' cm' }, { label: 'Body weight', value: v.weightKg+' kg' },
      { label: 'Takeoff velocity', value: takeoffV.toFixed(2)+' m/s' },
      { label: 'Peak power', value: peakPower.toFixed(0)+' W' }, { label: 'Relative power', value: (peakPower/v.weightKg).toFixed(1)+' W/kg' },
    ]}
  }, description: 'Calculate peak power output from vertical jump height using the Lewis formula. Power = 2.21 × weight × √(jump height × g).', formula: 'Peak Power = 2.21 × weight × √(2·g·h)', interpretation: 'Higher peak power indicates greater explosive lower body strength. Elite jumpers produce 50+ W/kg.'
}

export default calcDef
