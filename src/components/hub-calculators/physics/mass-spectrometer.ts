import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Particle Mass', type: 'number', unit: 'kg', min: 1e-27, step: '1e-27' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 1, step: '1' }, { name: 'charge', label: 'Particle Charge', type: 'number', unit: 'C', min: 1.602e-19, step: '1.602e-19' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.01, step: '0.01' }],
  defaults: { mass: '1', velocity: '1', charge: '1', field: '1' },
  presets: [
    { label: 'Standard example 1', values: { mass: '1', velocity: '1', charge: '1', field: '1' } },
    { label: 'Standard example 2', values: { mass: '10', velocity: '10', charge: '10', field: '10' } },
    { label: 'Standard example 3', values: { mass: '100', velocity: '100', charge: '100', field: '100' } },
  ],
  compute: (v) => { const r = v.mass * v.velocity / (v.charge * v.field); return { result: r, label: 'Radius of Path', unit: 'm', steps: [{ label: 'Formula', value: 'r = mv/(qB)' }, { label: 'Substitute', value: `${v.mass}×${v.velocity}/(${v.charge}×${v.field})` }, { label: 'Result', value: `${r.toExponential(4)} m` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'A mass spectrometer separates ions by mass-to-charge ratio using a magnetic field. Particles with different m/q follow different circular paths.',
  formula: 'r = mv/(qB)',
  interpretation: 'The radius is proportional to mass and inversely proportional to charge and field strength. Mass spectrometers identify substances by their mass-to-charge ratio fingerprint.'
}

export default calcDef
