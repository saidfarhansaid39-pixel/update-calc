import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ powerW: z.string().min(1).refine(v => parseFloat(v) > 0), hrSteady: z.string().min(1).refine(v => parseFloat(v) > 0), age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120)), weight: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'powerW', label: 'Cycle Power', type: 'number', unit: 'W', min: 25, step: '5' },
    { name: 'hrSteady', label: 'Steady-State HR', type: 'number', unit: 'bpm', min: 60, step: '1' },
    { name: 'age', label: 'Age (optional)', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'weight', label: 'Weight (optional)', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const pctHR = v.hrSteady / (v.age ? 208 - 0.7*v.age : 190); const vo2Est = (v.powerW * 12) / (v.weight || 70) / pctHR
    return { result: vo2Est, label: 'Est. VO2max', unit: 'mL/kg/min', steps: [
      { label: 'Power', value: v.powerW+' W' }, { label: 'HR at steady state', value: v.hrSteady+' bpm ('+(pctHR*100).toFixed(0)+'% max)' },
      { label: 'Est. VO2max', value: vo2Est.toFixed(1)+' mL/kg/min' }, { label: 'Protocol', value: 'Submaximal Astrand cycle test' },
    ]}
  }, description: 'Estimate VO2max from submaximal cycling using the Astrand-Ryhming protocol. Heart rate response at known workload predicts aerobic capacity.', formula: 'VO2max = (W × 12 / weight) / HR%max', interpretation: 'Lower HR at same power output = higher aerobic capacity and cycling efficiency.'
}

export default calcDef
