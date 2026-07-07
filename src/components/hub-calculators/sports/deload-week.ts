import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ normalVolume: z.string().min(1).refine(v => parseFloat(v) > 0), deloadPct: z.string().optional().refine(v => !v || (parseFloat(v) >= 40 && parseFloat(v) <= 70)) }),
  fields: [
    { name: 'normalVolume', label: 'Normal Weekly Volume', type: 'number', unit: 'kg', min: 1, step: '1' },
    { name: 'deloadPct', label: 'Deload % (optional)', type: 'number', unit: '%', min: 40, max: 70, step: '5' },
  ],
  compute: (v) => {
    const pct = v.deloadPct || 50; const deloadVol = v.normalVolume * (pct / 100)
    return { result: deloadVol, label: 'Deload Volume', unit: 'kg', steps: [
      { label: 'Normal volume', value: v.normalVolume.toFixed(0)+' kg' },
      { label: 'Deload percentage', value: pct+'%' },
      { label: 'Deload volume', value: deloadVol.toFixed(0)+' kg' },
      { label: 'Recommendation', value: 'Reduce volume by 40-60% while maintaining intensity for active recovery' },
    ]}
  }, description: 'Calculate deload week training volume. Deload weeks reduce training stress to promote recovery and long-term progress.', formula: 'Deload volume = normal volume × (deload% / 100)', interpretation: 'Deload weeks every 4-8 weeks prevent overtraining and allow super-compensation. Maintain intensity but reduce volume.'
}

export default calcDef
