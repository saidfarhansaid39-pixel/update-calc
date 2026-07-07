import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    crr: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 && val <= 0.02 }, '0-0.02'),
    speedKmh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'weightKg', label: 'Rider + Bike Weight', type: 'number', unit: 'kg', min: 40, step: '1' },
    { name: 'crr', label: 'Coefficient of Rolling Resistance', type: 'number', min: 0.001, max: 0.02, step: '0.001' },
    { name: 'speedKmh', label: 'Speed', type: 'number', unit: 'km/h', min: 10, step: '1' },
  ],
  compute: (v) => {
    const speedMs = v.speedKmh / 3.6
    const rrW = 9.81 * v.weightKg * speedMs * v.crr
    const totalW = rrW + 0.5 * 1.225 * speedMs * speedMs * speedMs * 0.3
    return {
      result: rrW, label: 'Rolling Resistance Power', unit: 'W',
      steps: [
        { label: 'System weight', value: `${v.weightKg} kg` },
        { label: 'Crr', value: `${v.crr.toFixed(4)} (typical road: 0.004-0.006)` },
        { label: 'Speed', value: `${v.speedKmh} km/h` },
        { label: 'Rolling resistance power', value: `${rrW.toFixed(1)} W` },
        { label: 'Total power required', value: `${totalW.toFixed(0)} W (incl. aero)` },
      ]
}
  },
  description: 'Calculate the power lost to tire rolling resistance while cycling. Crr varies from ~0.002 for track tires to ~0.010 for mountain bike tires. Lower Crr means faster speeds at the same power output.'
}

export default calcDef
