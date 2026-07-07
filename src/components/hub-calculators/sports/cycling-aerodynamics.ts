import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    speedKmh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    cda: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 && val <= 1 }, '0-1 m²'),
    weightKg: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    grade: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'speedKmh', label: 'Speed', type: 'number', unit: 'km/h', min: 10, step: '1' },
    { name: 'cda', label: 'Drag Coefficient (CdA)', type: 'number', unit: 'm²', min: 0.1, max: 1, step: '0.01' },
    { name: 'weightKg', label: 'Rider+Bike (optional)', type: 'number', unit: 'kg', min: 40, step: '1' },
    { name: 'grade', label: 'Grade (optional)', type: 'number', unit: '%', min: 0, max: 20, step: '0.5' },
  ],
  compute: (v) => {
    const speedMs = v.speedKmh / 3.6
    const rho = 1.225
    const dragW = 0.5 * rho * speedMs * speedMs * speedMs * v.cda
    const powerW = v.weightKg && v.grade ? dragW + 9.81 * v.weightKg * speedMs * Math.sin(Math.atan(v.grade / 100)) + 9.81 * v.weightKg * speedMs * 0.004 : dragW
    const savings = (v.cda - 0.25) * 0.5 * rho * speedMs * speedMs * speedMs * 0.02
    return {
      result: dragW, label: 'Aerodynamic Drag Power', unit: 'W',
      steps: [
        { label: 'Speed', value: `${v.speedKmh} km/h (${speedMs.toFixed(2)} m/s)` },
        { label: 'Drag coefficient', value: `${v.cda} m²` },
        { label: 'Air density', value: `${rho} kg/m³` },
        { label: 'Drag power loss', value: `${dragW.toFixed(0)} W` },
        ...(savings > 0 ? [{ label: 'Saving ~0.02 CdA', value: `~${savings.toFixed(1)} W saved` }] : []),
      ]
}
  },
  description: 'Estimate aerodynamic drag power while cycling at a given speed. At 40 km/h, ~80% of total power output goes to overcoming air resistance. Reducing CdA from 0.30 to 0.25 saves significant watts.'
}

export default calcDef
