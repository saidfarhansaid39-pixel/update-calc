import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    value: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    fromUnit: z.string().min(1, 'Required')
}),
  fields: [
    { name: 'value', label: 'Dose Value', type: 'number', unit: '', min: 0, step: '0.01' },
    { name: 'fromUnit', label: 'From Unit', type: 'select', options: [
      { label: 'Sv (sievert)', value: 'Sv' },
      { label: 'mSv (millisievert)', value: 'mSv' },
      { label: 'μSv (microsievert)', value: 'uSv' },
      { label: 'Gy (gray)', value: 'Gy' },
      { label: 'mGy (milligray)', value: 'mGy' },
      { label: 'rad', value: 'rad' },
      { label: 'rem', value: 'rem' },
    ] },
  ],
  compute: (v) => {
    const toSv: Record<string, number> = { 'Sv': 1, 'mSv': 0.001, 'uSv': 0.000001, 'Gy': 1, 'mGy': 0.001, 'rad': 0.01, 'rem': 0.01 }
    const labelName: Record<string, string> = { 'Sv': 'Sievert', 'mSv': 'Millisievert', 'uSv': 'Microsievert', 'Gy': 'Gray', 'mGy': 'Milligray', 'rad': 'Rad', 'rem': 'Rem' }
    const inSv = v.value * toSv[v.fromUnit]
    const isGamma = v.fromUnit === 'Sv' || v.fromUnit === 'mSv' || v.fromUnit === 'uSv' || v.fromUnit === 'rem'
    return {
      result: inSv, label: 'Equivalent Dose in Sv', unit: 'Sv',
      steps: [
        { label: `Input: ${v.value} ${labelName[v.fromUnit]}`, value: `${v.value} ${v.fromUnit}` },
        { label: 'In Sv', value: `${inSv.toExponential(4)} Sv` },
        { label: 'In mSv', value: `${(inSv * 1000).toFixed(2)} mSv` },
        { label: 'In μSv', value: `${(inSv * 1e6).toFixed(0)} μSv` },
        { label: 'In Gy', value: `${inSv} Gy (gamma/beta) or ${inSv * 20} Gy (alpha)` },
        { label: 'Type', value: isGamma ? 'Equivalent dose (Sv)' : 'Absorbed dose (Gy) ' },
      ]
}
  },
  description: 'Radiation dose units conversion. Sv (sievert) measures biological effect; Gy (gray) measures energy absorbed. Alpha radiation causes ~20× more biological damage than gamma/beta.',
  formula: '1 Sv = 100 rem | 1 Gy = 100 rad | For γ/β: Sv = Gy | For α: Sv = 20 × Gy',
  interpretation: 'Background: ~2.4 mSv/year. Chest X-ray: ~0.1 mSv. CT scan: ~10 mSv. Annual limit for radiation workers: 50 mSv. Acute radiation syndrome: >1 Sv.'
}

export default calcDef
