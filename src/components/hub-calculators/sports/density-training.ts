import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ volume: z.string().min(1).refine(v => parseFloat(v) > 0), timeMin: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'volume', label: 'Total Volume Load', type: 'number', unit: 'kg', min: 1, step: '1' },
    { name: 'timeMin', label: 'Session Duration', type: 'number', unit: 'min', min: 1, step: '1' },
  ],
  compute: (v) => {
    const density = v.volume / v.timeMin
    return { result: density, label: 'Training Density', unit: 'kg/min', steps: [
      { label: 'Total volume', value: v.volume+' kg' }, { label: 'Time', value: v.timeMin+' min' },
      { label: 'Density', value: density.toFixed(1)+' kg/min' },
      { label: 'Interpretation', value: 'Higher density = more work in less time. Density training increases work capacity.' },
    ]}
  }, description: 'Calculate training density (volume per minute). Density training improves work capacity by compressing more work into less time.', formula: 'Density = total volume (kg) / time (min)', interpretation: 'Gradually increase training density by reducing rest periods while maintaining or increasing volume load.'
}

export default calcDef
