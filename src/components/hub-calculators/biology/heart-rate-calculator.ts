import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
    restingHR: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'age', label: 'Age', type: 'number', unit: 'years', min: 1, max: 120, step: '1' },
    { name: 'restingHR', label: 'Resting HR (optional)', type: 'number', unit: 'bpm', min: 30, step: '1' },
  ],
  compute: (v) => {
    const maxHR = 220 - v.age
    const resting = v.restingHR || 60
    const hrr = maxHR - resting
    const zones = [50, 60, 70, 80, 90].map(p => ({ pct: p, hr: resting + hrr * (p / 100) }))
    return {
      result: zones[2].hr, label: 'Target HR (70%)', unit: 'bpm',
      steps: [
        { label: 'Age', value: `${v.age} years` },
        { label: 'Max HR', value: `${maxHR} bpm` },
        { label: 'Resting HR', value: `${resting} bpm` },
        { label: 'HR Reserve', value: `${hrr} bpm` },
        ...zones.map(z => ({ label: `${z.pct}% zone`, value: `${z.hr.toFixed(0)} bpm` })),
      ]
}
  },
  description: 'Calculate heart rate training zones using the Karvonen formula. Train at the right intensity for endurance, fat burn, or high-intensity intervals.',
  formula: 'Target HR = Resting HR + (Max HR – Resting HR) × Intensity% | Max HR = 220 – Age',
  interpretation: 'Zone 1 (50-60%): Recovery | Zone 2 (60-70%): Endurance | Zone 3 (70-80%): Aerobic | Zone 4 (80-90%): Threshold | Zone 5 (90-100%): Maximal.'
}

export default calcDef
