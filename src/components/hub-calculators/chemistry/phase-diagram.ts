import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    pressure: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    tripleTemp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    criticalTemp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 0.1, step: '0.1' },
    { name: 'pressure', label: 'Pressure', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'tripleTemp', label: 'Triple Point Temperature', type: 'number', unit: 'K', min: 0.1, step: '0.1' },
    { name: 'criticalTemp', label: 'Critical Temperature', type: 'number', unit: 'K', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const phase = v.temp > v.criticalTemp ? 'Supercritical fluid' : v.temp < v.tripleTemp ? 'Solid or gas (below triple point)' : 'Liquid or gas (above triple point)'
    return {
      result: phase, label: 'Phase Region', unit: '',
      steps: [
        { label: 'T', value: `${v.temp} K` },
        { label: 'P', value: `${v.pressure} atm` },
        { label: 'Triple point', value: `${v.tripleTemp} K` },
        { label: 'Critical point', value: `${v.criticalTemp} K` },
        { label: 'Region', value: phase },
      ]
}
  },
  description: 'A phase diagram maps the state of matter (solid, liquid, gas, supercritical) as a function of temperature and pressure. The triple point has all three phases coexisting.',
  formula: 'Phase regions defined by Clapeyron equation along boundaries',
  interpretation: 'Above the critical temperature, the substance is supercritical — it has properties between gas and liquid. For water: triple point = 273.16 K, critical point = 647 K, 218 atm.'
}

export default calcDef
