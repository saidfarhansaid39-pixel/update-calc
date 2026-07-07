import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weeksPerPhase: z.string().min(1).refine(v => parseFloat(v) > 0), phases: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'weeksPerPhase', label: 'Weeks Per Phase', type: 'number', min: 2, max: 8, step: '1' },
    { name: 'phases', label: 'Number of Phases', type: 'number', min: 2, max: 6, step: '1' },
  ],
  compute: (v) => {
    const totalWeeks = v.weeksPerPhase * v.phases
    return { result: totalWeeks, label: 'Total Program Duration', unit: 'weeks', steps: [
      { label: 'Weeks per phase', value: ''+v.weeksPerPhase }, { label: 'Number of phases', value: ''+v.phases },
      { label: 'Total program', value: totalWeeks+' weeks ('+Math.floor(totalWeeks/4)+' months)' },
      { label: 'Phasing', value: 'Typical: hypertrophy → strength → peaking → deload' },
    ]}
  }, description: 'Plan training periodization cycles. Periodization organizes training into phases for progressive adaptation and peak performance.', formula: 'Total = weeks per phase × number of phases', interpretation: 'Linear periodization progresses from high volume/low intensity to low volume/high intensity over time.'
}

export default calcDef
