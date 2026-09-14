import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), harmonic: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'length', label: 'String Length', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'harmonic', label: 'Harmonic Number', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  defaults: { length: '1', harmonic: '1' },
  presets: [
    { label: 'Standard example 1', values: { length: '1', harmonic: '1' } },
    { label: 'Standard example 2', values: { length: '10', harmonic: '10' } },
    { label: 'Standard example 3', values: { length: '100', harmonic: '100' } },
  ],
  compute: (v) => { const lambda = 2 * v.length / v.harmonic; return { result: lambda, label: 'Wavelength', unit: 'm', steps: [{ label: 'Formula', value: 'λ_n = 2L/n' }, { label: 'Substitute', value: `2 × ${v.length} / ${v.harmonic}` }, { label: 'Wavelength', value: `${lambda.toFixed(4)} m` }, { label: 'Nodes', value: `${v.harmonic + 1}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'Standing waves form when waves of equal amplitude and frequency travel in opposite directions, producing nodes and antinodes at fixed positions.',
  formula: 'λ_n = 2L/n, f_n = nv/(2L)',
  interpretation: 'The fundamental (n = 1) has the longest wavelength. Higher harmonics have shorter wavelengths and more nodes. Standing waves are the basis of musical instrument string vibrations.'
}

export default calcDef
