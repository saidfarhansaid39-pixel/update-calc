import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'sma', label: 'Semi-Major Axis a', type: 'number', unit: 'AU', min: 0.01, step: '0.01' }, { name: 'mass', label: 'Central Mass M', type: 'number', unit: 'M_sun', min: 0.001, step: '0.001' }],
  defaults: { sma: '1', mass: '1' },
  presets: [
    { label: 'Standard example 1', values: { sma: '1', mass: '1' } },
    { label: 'Standard example 2', values: { sma: '10', mass: '10' } },
    { label: 'Standard example 3', values: { sma: '100', mass: '100' } },
  ],
  compute: (v) => { const G = 6.674e-11; const M_sun = 1.989e30; const AU = 1.496e11; const a = v.sma * AU; const M = v.mass * M_sun; const T = 2 * Math.PI * Math.sqrt(a * a * a / (G * M)); const T_years = T / (365.25 * 24 * 3600); return { result: T_years, label: 'Orbital Period', unit: 'years', steps: [{ label: 'Formula', value: 'T² = 4π²a³/(GM)' }, { label: 'Result', value: `${T_years.toFixed(2)} years` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Kepler\'s Third Law: the square of the orbital period is proportional to the cube of the semi-major axis. T² = 4π²a³/(GM).',
  formula: 'T² = 4π²·a³/(GM)',
  interpretation: 'For the Solar System, T² = a³ when T is in years and a in AU. Earth: a = 1 AU, T = 1 year. Jupiter: a = 5.2 AU, T = 11.9 years. The constant depends on the central mass.'
}

export default calcDef
