import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'temp', label: 'Oven Temp', type: 'number', unit: '°C', min: 100, step: '5' },
      { name: 'time', label: 'Oven Time', type: 'number', unit: 'min', min: 5, step: '5' }
    ],
    compute: (v) => {
      const at = v.temp - 20; const atm = Math.round(v.time * 0.75); return { result: at, label: 'Air Fryer Temp', unit: '°C', steps: [{ label: 'Oven', value: v.temp + '°C for ' + v.time + ' min' }, { label: 'Air fryer', value: at + '°C for ' + atm + ' min' }] }
    },
    description: 'Convert oven recipes to air fryer. Reduce temp 20°C and time 25%.',
    example: { label: '200°C for 20 min', value: '180°C for 15 min' }
}

export default calcDef
