import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'temp', label: 'Conventional Temp', type: 'number', unit: '°C', min: 100, step: '5' },
      { name: 'time', label: 'Conventional Time', type: 'number', unit: 'min', min: 5, step: '5' }
    ],
    compute: (v) => {
      const ct = v.temp - 20; const ctm = Math.round(v.time * 0.75); return { result: ct, label: 'Convection Temp', unit: '°C', steps: [{ label: 'Conventional', value: v.temp + '°C for ' + v.time + ' min' }, { label: 'Convection', value: ct + '°C for ' + ctm + ' min' }, { label: 'Savings', value: '-20°C, -25% time' }] }
    },
    description: 'Convert conventional to convection (fan-forced). Reduce temp 20°C and time 25%.',
    example: { label: '180°C for 60 min', value: '160°C for 45 min' }
}

export default calcDef
