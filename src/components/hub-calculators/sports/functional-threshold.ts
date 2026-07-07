import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    testPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    testDuration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    weightKg: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'testPower', label: 'Average Power During Test', type: 'number', unit: 'W', min: 50, step: '5' },
    { name: 'testDuration', label: 'Test Duration', type: 'number', unit: 'min', min: 1, max: 60, step: '1' },
    { name: 'weightKg', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 40, step: '0.5' },
  ],
  compute: (v) => {
    const pct = v.testDuration >= 60 ? 0.95 : v.testDuration >= 20 ? 0.95 : v.testDuration >= 8 ? 0.90 : 0.85
    const ftp = v.testPower * pct
    const wkg = v.weightKg ? ftp / v.weightKg : 0
    return {
      result: ftp, label: 'Estimated FTP', unit: 'W',
      steps: [
        { label: 'Test power', value: `${v.testPower} W over ${v.testDuration} min` },
        { label: 'Adjustment factor', value: `${(pct * 100).toFixed(0)}%` },
        { label: 'Estimated FTP', value: `${ftp.toFixed(0)} W` },
        ...(v.weightKg ? [{ label: 'FTP (W/kg)', value: `${wkg.toFixed(2)} W/kg` }] : []),
        { label: 'Power zones (65-90% FTP)', value: `${(ftp * 0.65).toFixed(0)}-${(ftp * 0.90).toFixed(0)} W Endurance/Tempo` },
      ]
}
  },
  description: 'Estimate your Functional Threshold Power (FTP) from a maximal effort test. FTP is the highest power you can sustain for ~1 hour and is the foundation of structured cycling training.'
}

export default calcDef
