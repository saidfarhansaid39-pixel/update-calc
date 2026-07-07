import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'sma', label: 'Semi-Major Axis a', type: 'number', unit: 'AU', min: 0.01, step: '0.01' }, { name: 'mass', label: 'Central Mass M', type: 'number', unit: 'M_sun', min: 0.001, step: '0.001' }],
  compute: (v) => { const G = 6.674e-11; const M_sun = 1.989e30; const AU = 1.496e11; const a = v.sma * AU; const M = v.mass * M_sun; const T = 2 * Math.PI * Math.sqrt(a * a * a / (G * M)); const T_years = T / (365.25 * 24 * 3600); return { result: T_years, label: 'Orbital Period', unit: 'years', steps: [{ label: 'Formula', value: 'T² = 4π²a³/(GM)' }, { label: 'Result', value: `${T_years.toFixed(2)} years` }] } },
  description: 'Kepler\'s Third Law: the square of the orbital period is proportional to the cube of the semi-major axis. T² = 4π²a³/(GM).',
  formula: 'T² = 4π²·a³/(GM)',
  interpretation: 'For the Solar System, T² = a³ when T is in years and a in AU. Earth: a = 1 AU, T = 1 year. Jupiter: a = 5.2 AU, T = 11.9 years. The constant depends on the central mass.'
}

export default calcDef
