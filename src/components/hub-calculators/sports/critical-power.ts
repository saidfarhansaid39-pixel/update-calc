import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    shortPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    shortDuration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    longPower: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    longDuration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'shortPower', label: 'Short Test Power', type: 'number', unit: 'W', min: 100, step: '5' },
    { name: 'shortDuration', label: 'Short Test Duration', type: 'number', unit: 'min', min: 1, max: 10, step: '0.5' },
    { name: 'longPower', label: 'Long Test Power', type: 'number', unit: 'W', min: 50, step: '5' },
    { name: 'longDuration', label: 'Long Test Duration', type: 'number', unit: 'min', min: 10, max: 60, step: '1' },
  ],
  compute: (v) => {
    const wPrime = (v.shortPower * v.shortDuration - v.longPower * v.longDuration) / (1 - v.shortDuration / v.longDuration)
    const cp = (v.shortPower - wPrime / v.shortDuration)
    const validCP = cp > 0 ? cp : v.longPower
    const validWprime = wPrime > 0 ? wPrime : (v.shortPower - v.longPower) * (v.shortDuration * v.longDuration) / (v.longDuration - v.shortDuration)
    return {
      result: validCP, label: 'Critical Power', unit: 'W',
      steps: [
        { label: 'Short effort', value: `${v.shortPower} W × ${v.shortDuration} min` },
        { label: 'Long effort', value: `${v.longPower} W × ${v.longDuration} min` },
        { label: 'Critical Power (CP)', value: `${validCP.toFixed(0)} W` },
        { label: 'W\' (anaerobic capacity)', value: `${validWprime.toFixed(0)} kJ` },
        { label: 'Max effort at CP', value: `${(validCP * 0.9).toFixed(0)} W sustainable for ~20 min` },
      ]
}
  },
  description: 'Calculate Critical Power (CP) and W\' (anaerobic work capacity) from two maximal efforts of different durations. CP represents sustainable power output and is a more precise training metric than FTP.'
}

export default calcDef
