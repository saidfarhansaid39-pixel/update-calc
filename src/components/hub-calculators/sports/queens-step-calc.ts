import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hrRecovery: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'hrRecovery', label: '15-sec Recovery Pulse', type: 'number', min: 15, step: '1' } ],
  compute: (v) => {
    const hrMin = v.hrRecovery * 4; const vo2 = 65.81 - 0.1847 * hrMin
    return { result: vo2, label: 'Estimated VO2max', unit: 'mL/kg/min', steps: [
      { label: '15-sec pulse', value: ''+v.hrRecovery }, { label: 'Est. HR (bpm)', value: hrMin+' bpm' },
      { label: 'VO2max', value: vo2.toFixed(1)+' mL/kg/min' },
      { label: 'Rating', value: vo2 > 45 ? 'Good to Excellent' : vo2 > 35 ? 'Average' : 'Below Average' },
    ]}
  }, description: 'Estimate VO2max using the Queens College Step Test (3 min at 22 steps/min, 16.25 in bench).', formula: 'VO2max = 65.81 - 0.1847 × HR (bpm)', interpretation: 'Lower recovery HR indicates better aerobic fitness after the step test protocol.'
}

export default calcDef
