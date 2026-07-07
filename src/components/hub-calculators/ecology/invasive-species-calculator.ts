import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    propagules: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    establishment: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    spreadRate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    years: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'propagules', label: 'Propagule Pressure (# introduced)', type: 'number', min: 1, step: '1' },
    { name: 'establishment', label: 'Establishment Rate', type: 'number', unit: '%', min: 0, max: 100, step: '1' },
    { name: 'spreadRate', label: 'Annual Spread Rate', type: 'number', unit: 'km/yr', min: 0.1, step: '0.1' },
    { name: 'years', label: 'Time Since Introduction', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    const established = v.propagules * v.establishment / 100
    const years = v.years || 1
    const invDist = v.spreadRate * years
    const invArea = Math.PI * invDist * invDist
    return {
      result: established, label: 'Established Individuals', unit: '',
      steps: [
        { label: 'Propagules introduced', value: `${v.propagules}` },
        { label: 'Establishment rate', value: `${v.establishment}%` },
        { label: 'Established', value: `${established.toFixed(0)}` },
        { label: 'Spread rate', value: `${v.spreadRate} km/yr` },
        { label: 'Time since intro', value: `${years} yr` },
        { label: 'Invasion radius', value: `${invDist.toFixed(1)} km` },
        { label: 'Invaded area ~', value: `${invArea.toFixed(0)} km²` },
      ]
}
  },
  description: 'Invasive species risk is assessed by propagule pressure, establishment success, and spread rate. Early detection and rapid response are key to management.',
  formula: 'Established = Propagules × Rate% | Area = π × (Spread × Years)²',
  interpretation: 'Higher propagule pressure = greater establishment. Lag phase: slow initial spread. Exponential phase: rapid spread. Saturation: full range filled.'
}

export default calcDef
