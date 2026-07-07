import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    systolic: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 60 && n <= 300 }, '60-300'),
    diastolic: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 30 && n <= 200 }, '30-200')
}),
  fields: [
    { name: 'systolic', label: 'Systolic BP', type: 'number', unit: 'mmHg', min: 60, max: 300, step: '1' },
    { name: 'diastolic', label: 'Diastolic BP', type: 'number', unit: 'mmHg', min: 30, max: 200, step: '1' },
  ],
  compute: (v) => {
    const map = v.diastolic + (v.systolic - v.diastolic) / 3
    const pp = v.systolic - v.diastolic
    const cat = v.systolic < 120 && v.diastolic < 80 ? 'Normal' : v.systolic < 130 && v.diastolic < 80 ? 'Elevated' : v.systolic < 140 || v.diastolic < 90 ? 'Stage 1 HTN' : 'Stage 2 HTN'
    return {
      result: map, label: 'Mean Arterial Pressure', unit: 'mmHg',
      steps: [
        { label: 'Systolic', value: `${v.systolic} mmHg` },
        { label: 'Diastolic', value: `${v.diastolic} mmHg` },
        { label: 'MAP', value: `${map.toFixed(0)} mmHg` },
        { label: 'Pulse pressure', value: `${pp} mmHg` },
        { label: 'BP classification', value: cat },
      ]
}
  },
  description: 'Mean Arterial Pressure (MAP) and Pulse Pressure are calculated from systolic and diastolic readings. MAP = 60 mmHg is needed for adequate organ perfusion.',
  formula: 'MAP = DBP + (SBP – DBP) / 3 | Pulse Pressure = SBP – DBP',
  interpretation: 'Normal: <120/<80 | Elevated: 120-129/<80 | Stage 1 HTN: 130-139/80-89 | Stage 2 HTN: =140/=90. MAP target: 65-110 mmHg.'
}

export default calcDef
