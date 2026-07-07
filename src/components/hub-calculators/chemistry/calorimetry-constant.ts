import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    heat: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dT: z.string().min(1, 'Required').refine(v => parseFloat(v) !== 0, 'Must not be 0')
}),
  fields: [
    { name: 'heat', label: 'Heat Absorbed (q)', type: 'number', unit: 'J', min: 0.1, step: '0.1' },
    { name: 'dT', label: 'Temperature Change (ΔT)', type: 'number', unit: '°C', step: '0.01' },
  ],
  compute: (v) => {
    const C = v.heat / v.dT
    return {
      result: C, label: 'Calorimeter Constant (C_cal)', unit: 'J/°C',
      steps: [
        { label: 'Heat input q', value: `${v.heat} J` },
        { label: 'ΔT', value: `${v.dT >= 0 ? '+' : ''}${v.dT} °C` },
        { label: 'C_cal = q / ΔT', value: `${C.toFixed(2)} J/°C` },
      ]
}
  },
  description: 'The calorimeter constant (heat capacity of the calorimeter) is the heat required to raise the calorimeter assembly temperature by one degree Celsius, determined experimentally.',
  formula: 'C_cal = q / ΔT',
  interpretation: 'A known amount of heat is added (e.g., via electric heater or known chemical reaction) and the temperature change is measured. Typical values: 10-1000 J/°C.'
}

export default calcDef
