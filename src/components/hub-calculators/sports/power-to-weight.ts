import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    weightKg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    powerWatts: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'weightKg', label: 'Rider Weight', type: 'number', unit: 'kg', min: 40, step: '0.5' },
    { name: 'powerWatts', label: 'Power Output', type: 'number', unit: 'W', min: 50, step: '5' },
  ],
  compute: (v) => {
    const wkg = v.powerWatts / v.weightKg
    let category = 'Recreational'
    if (wkg > 6.0) category = 'World Tour Pro'
    else if (wkg > 5.0) category = 'Elite domestic pro'
    else if (wkg > 4.0) category = 'Cat 1 racer'
    else if (wkg > 3.2) category = 'Cat 3 racer'
    else if (wkg > 2.5) category = 'Trained club rider'
    return {
      result: wkg, label: 'Power-to-Weight Ratio', unit: 'W/kg',
      steps: [
        { label: 'Rider weight', value: `${v.weightKg} kg` },
        { label: 'Power output', value: `${v.powerWatts} W` },
        { label: 'W/kg', value: `${wkg.toFixed(2)} W/kg` },
        { label: 'Racing category', value: category },
        { label: 'FTP estimate (95%)', value: `${(wkg * 0.95).toFixed(2)} W/kg for 1-hour effort` },
      ]
}
  },
  description: 'Calculate your cycling power-to-weight ratio (W/kg). This is the most important predictor of climbing performance, determining how fast you can ascend hills.'
}

export default calcDef
