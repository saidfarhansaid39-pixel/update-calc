import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ speedKmh: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'speedKmh', label: 'Running Speed', type: 'number', unit: 'km/h', min: 5, step: '0.5' } ],
  compute: (v) => {
    const smin = v.speedKmh * 1000 / 60; const vo2 = 0.2 * smin + 3.5
    return { result: vo2, label: 'VO2 at this Speed', unit: 'mL/kg/min', steps: [
      { label: 'Speed', value: v.speedKmh+' km/h ('+smin.toFixed(0)+' m/min)' },
      { label: 'VO2', value: vo2.toFixed(1)+' mL/kg/min' }, { label: 'METs', value: (vo2/3.5).toFixed(1)+' METs' },
    ]}
  }, description: 'Estimate oxygen cost of running using ACSM metabolic equation. Running VO2 increases linearly with speed.', formula: 'VO2 = 0.2 × speed (m/min) + 3.5', interpretation: 'Higher running speeds require proportionally more oxygen consumption.'
}

export default calcDef
