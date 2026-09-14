import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m0: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mf: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ve: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm0', label: 'Initial Mass (wet)', type: 'number', unit: 'kg', min: 1, step: '1' }, { name: 'mf', label: 'Final Mass (dry)', type: 'number', unit: 'kg', min: 1, step: '1' }, { name: 've', label: 'Exhaust Velocity vₑ', type: 'number', unit: 'm/s', min: 100, step: '100' }],
  defaults: { m0: '1', mf: '1', ve: '1' },
  presets: [
    { label: 'Standard example 1', values: { m0: '1', mf: '1', ve: '1' } },
    { label: 'Standard example 2', values: { m0: '10', mf: '10', ve: '10' } },
    { label: 'Standard example 3', values: { m0: '100', mf: '100', ve: '100' } },
  ],
  compute: (v) => { const dv = v.ve * Math.log(v.m0 / v.mf); const MR = v.m0 / v.mf; return { result: dv, label: 'Delta-v', unit: 'm/s', steps: [{ label: 'Formula', value: 'Δv = vₑ·ln(m₀/m_f)' }, { label: 'Mass ratio', value: `${MR.toFixed(2)}:1` }, { label: 'Delta-v', value: `${dv.toFixed(1)} m/s` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Tsiolkovsky rocket equation gives the maximum velocity change a rocket can achieve based on its mass ratio and exhaust velocity.',
  formula: 'Δv = vₑ·ln(m₀/m_f)',
  interpretation: 'Saturn V had mass ratio ~20 and exhaust velocity ~3 km/s, giving ~9 km/s delta-v (enough for LEO). Higher exhaust velocity dramatically improves performance. Multi-stage rockets minimize dead weight.'
}

export default calcDef
