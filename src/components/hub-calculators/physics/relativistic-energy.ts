import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'mass', label: 'Rest Mass', type: 'number', unit: 'kg', min: 1e-31, step: '1e-31' }, { name: 'velocity', label: 'Velocity v', type: 'number', unit: 'm/s', min: 0, step: '1e7' }],
  defaults: { mass: '1', velocity: '1' },
  presets: [
    { label: 'Standard example 1', values: { mass: '1', velocity: '1' } },
    { label: 'Standard example 2', values: { mass: '10', velocity: '10' } },
    { label: 'Standard example 3', values: { mass: '100', velocity: '100' } },
  ],
  compute: (v) => { const c = 299792458; const gamma = 1 / Math.sqrt(1 - (v.velocity * v.velocity) / (c * c)); const E = gamma * v.mass * c * c; const KE = (gamma - 1) * v.mass * c * c; return { result: E, label: 'Total Relativistic Energy', unit: 'J', steps: [{ label: 'Formula', value: 'E = γmc²' }, { label: 'γ', value: `${gamma.toFixed(4)}` }, { label: 'Rest energy', value: `${(v.mass * c * c).toExponential(4)} J` }, { label: 'Kinetic energy', value: `${KE.toExponential(4)} J` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Total relativistic energy E = γmc² includes both rest energy and kinetic energy. At low speeds, KE ≈ ½mv².',
  formula: 'E = γmc², KE = (γ-1)mc²',
  interpretation: 'The rest energy mc² is always present. At v = 0.5c, KE is 15.5% of rest energy. At v = 0.9c, KE exceeds rest energy. Particle accelerators routinely use relativistic energies.'
}

export default calcDef
