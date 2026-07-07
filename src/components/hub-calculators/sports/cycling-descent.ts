import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    grade: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val >= 0 && val <= 30 }, '0-30%'),
    cda: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 && val <= 1 }, '0-1 m²'),
    weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    crr: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 && val <= 0.02 }, '0-0.02')
}),
  fields: [
    { name: 'grade', label: 'Descent Grade', type: 'number', unit: '%', min: 0, max: 30, step: '0.5' },
    { name: 'cda', label: 'Drag Coefficient (CdA)', type: 'number', unit: 'm²', min: 0.1, max: 1, step: '0.01' },
    { name: 'weightKg', label: 'Rider + Bike Weight', type: 'number', unit: 'kg', min: 40, step: '1' },
    { name: 'crr', label: 'Rolling Resistance', type: 'number', min: 0.001, max: 0.02, step: '0.001' },
  ],
  compute: (v) => {
    const gradeRad = Math.atan(v.grade / 100)
    const rho = 1.225
    const mgSinTheta = 9.81 * v.weightKg * Math.sin(gradeRad)
    const mgCrrCosTheta = 9.81 * v.weightKg * v.crr * Math.cos(gradeRad)
    const speedMs = Math.cbrt((mgSinTheta - mgCrrCosTheta) / (0.5 * rho * v.cda))
    const speedKmh = Math.max(0, speedMs * 3.6)
    return {
      result: speedKmh, label: 'Estimated Descent Speed', unit: 'km/h',
      steps: [
        { label: 'Grade', value: `${v.grade}%` },
        { label: 'System weight', value: `${v.weightKg} kg` },
        { label: 'CdA', value: `${v.cda} m²` },
        { label: 'Gravitational force', value: `${mgSinTheta.toFixed(0)} N` },
        { label: 'Terminal speed', value: `${speedKmh.toFixed(1)} km/h` },
        { label: 'Descent type', value: speedKmh > 70 ? 'Very fast — aero tuck recommended' : speedKmh > 50 ? 'Fast descent' : 'Moderate descent' },
      ]
}
  },
  description: 'Estimate terminal descent speed on a bicycle given grade, rider position, and weight. Steeper grades and lower CdA yield higher speeds until aerodynamic drag balances gravitational force.'
}

export default calcDef
